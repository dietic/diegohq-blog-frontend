'use client';

import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import Navbar from '../Navbar/Navbar';
import { useWindowManager } from '../Window/WindowContext';
import { Window } from '../Window/Window';
import { PostWindow } from '../WindowContent';
import {
  getVisibleIcons,
  getIconPosition,
  isExternalIcon,
  type DesktopIconConfig,
} from '@/config/desktop';
import { useAuth } from '@/contexts/AuthContext';
import type {
  PostSummaryResponse,
  PostResponse,
  QuestResponse,
  ItemResponse,
} from '@/lib/api/types';
import { getPostBySlug } from '@/lib/api/services/public';
import './Desktop.scss';

type BeforeCloseHandler = () => boolean;

interface DesktopClientProps {
  posts: PostSummaryResponse[];
  quests: QuestResponse[];
  items: ItemResponse[];
  initialPost?: PostResponse;
}

export function DesktopClient({
  posts,
  quests,
  items,
  initialPost,
}: DesktopClientProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const {
    openWindows,
    activeWindowId,
    closeWindow,
    focusWindow,
    openWindow,
    minimizeWindow,
  } = useWindowManager();

  const [openedPosts, setOpenedPosts] = useState<Record<string, PostResponse>>({});

  // Store beforeClose handlers by window ID
  const beforeCloseHandlersRef = useRef<Record<string, BeforeCloseHandler>>({});

  const registerBeforeClose = useCallback((windowId: string, handler: BeforeCloseHandler) => {
    beforeCloseHandlersRef.current[windowId] = handler;
  }, []);

  const getBeforeClose = useCallback((windowId: string) => {
    return beforeCloseHandlersRef.current[windowId];
  }, []);

  const forceCloseWindow = useCallback((windowId: string) => {
    // Remove the beforeClose handler and close directly
    delete beforeCloseHandlersRef.current[windowId];
    closeWindow(windowId);
  }, [closeWindow]);

  // Get visible icons based on auth state
  const visibleIcons = useMemo(
    () => getVisibleIcons(isAuthenticated),
    [isAuthenticated]
  );

  // Forward declaration for handleOpenWindow to use in handleOpenPost
  const handleOpenWindowRef = useRef<(id: string) => void>(() => {});

  const handleOpenPost = useCallback(
    async (slug: string) => {
      let post = openedPosts[slug];

      if (!post) {
        const fetchedPost = await getPostBySlug(slug);
        if (!fetchedPost) return;
        post = fetchedPost;
        setOpenedPosts((prev) => ({ ...prev, [slug]: post }));
      }

      const windowId = `post-${slug}`;
      openWindow({
        id: windowId,
        title: post.title,
        component: (
          <PostWindow
            post={post}
            onOpenWindow={(id) => handleOpenWindowRef.current(id)}
            registerCloseHandler={(handler) => registerBeforeClose(windowId, handler)}
            onForceClose={() => forceCloseWindow(windowId)}
          />
        ),
        icon: post.icon || '/desktop-icons/mypc.png',
        initialMaximized: true,
      });
    },
    [openedPosts, openWindow, registerBeforeClose, forceCloseWindow]
  );

  // Track if initial post has been opened to avoid re-opening on re-renders
  const initialPostOpenedRef = useRef(false);

  // Open initial post window if provided via URL (e.g., /post/[slug])
  useEffect(() => {
    if (initialPost && !initialPostOpenedRef.current) {
      initialPostOpenedRef.current = true;
      setOpenedPosts((prev) => ({ ...prev, [initialPost.slug]: initialPost }));
      const windowId = `post-${initialPost.slug}`;
      openWindow({
        id: windowId,
        title: initialPost.title,
        component: (
          <PostWindow
            post={initialPost}
            onOpenWindow={(id) => handleOpenWindowRef.current(id)}
            registerCloseHandler={(handler) => registerBeforeClose(windowId, handler)}
            onForceClose={() => forceCloseWindow(windowId)}
          />
        ),
        icon: initialPost.icon || '/desktop-icons/mypc.png',
        initialMaximized: true,
      });
    }
  }, [initialPost, openWindow, registerBeforeClose, forceCloseWindow]);

  // Handler for opening a window by ID (used for login/signup switching)
  const handleOpenWindow = useCallback(
    (windowId: string) => {
      const icon = visibleIcons.find((i) => i.id === windowId);
      if (icon && !isExternalIcon(icon)) {
        openWindow({
          id: icon.id,
          title: icon.windowTitle,
          component: icon.window({
            posts,
            quests,
            items,
            onOpenPost: handleOpenPost,
            onOpenWindow: (id: string) => handleOpenWindowRef.current(id),
          }),
          icon: icon.icon,
        });
      }
    },
    [visibleIcons, posts, quests, items, openWindow, handleOpenPost]
  );

  // Keep ref updated with latest handleOpenWindow
  useEffect(() => {
    handleOpenWindowRef.current = handleOpenWindow;
  }, [handleOpenWindow]);

  const handleIconDoubleClick = useCallback(
    (icon: DesktopIconConfig) => {
      // External link - open in new tab
      if (isExternalIcon(icon)) {
        window.open(icon.externalUrl, '_blank', 'noopener,noreferrer');
        return;
      }

      // Internal window - render the component
      openWindow({
        id: icon.id,
        title: icon.windowTitle,
        component: icon.window({
          posts,
          quests,
          items,
          onOpenPost: handleOpenPost,
          onOpenWindow: handleOpenWindow,
        }),
        icon: icon.icon,
      });
    },
    [posts, quests, items, openWindow, handleOpenPost, handleOpenWindow]
  );

  return (
    <div className="hq-desktop">
      <Navbar />
      <div className="hq-desktop__content">
        {!isLoading && visibleIcons.map((icon) => {
          const position = getIconPosition(icon.position.x, icon.position.y);
          return (
            <DesktopIcon
              key={`${isAuthenticated ? 'auth' : 'guest'}-${icon.id}`}
              label={icon.label}
              icon={icon.icon}
              initialX={position.x}
              initialY={position.y}
              onDoubleClick={() => handleIconDoubleClick(icon)}
            />
          );
        })}

        {openWindows.map((win) => (
          <Window
            key={win.id}
            windowTitle={win.title}
            windowIcon={win.icon}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            isOpen={true}
            onMouseDown={() => focusWindow(win.id)}
            beforeClose={getBeforeClose(win.id)}
            initialMaximized={win.initialMaximized}
            style={{
              zIndex: activeWindowId === win.id ? 200 : 100,
              display: win.isMinimized ? 'none' : 'block',
            }}
          >
            {win.component}
          </Window>
        ))}
      </div>
    </div>
  );
}
