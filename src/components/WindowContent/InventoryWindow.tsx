'use client';

import { useState } from 'react';
import type { ItemResponse } from '@/lib/api/types';
import './WindowContent.scss';

interface InventoryWindowProps {
  items: ItemResponse[];
}

const rarityColors: Record<string, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  legendary: '#f59e0b',
};

const rarityGlow: Record<string, string> = {
  common: 'none',
  uncommon: '0 0 8px rgba(34, 197, 94, 0.5)',
  rare: '0 0 8px rgba(59, 130, 246, 0.5)',
  legendary: '0 0 12px rgba(245, 158, 11, 0.7)',
};

export function InventoryWindow({ items }: InventoryWindowProps) {
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredItems =
    filter === 'all' ? items : items.filter((i) => i.rarity === filter);

  return (
    <div className="window-content inventory">
      <div className="inventory__header">
        <h2 className="inventory__title">Inventory</h2>
        <div className="inventory__filters">
          <button
            className={`inventory__filter ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {['common', 'uncommon', 'rare', 'legendary'].map((rarity) => (
            <button
              key={rarity}
              className={`inventory__filter ${filter === rarity ? 'active' : ''}`}
              onClick={() => setFilter(rarity)}
              style={{ color: rarityColors[rarity] }}
            >
              {rarity}
            </button>
          ))}
        </div>
      </div>

      <div className={`inventory__container ${selectedItem ? 'inventory__container--with-details' : ''}`}>
        <div className="inventory__grid">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.item_id}
                className={`inventory__slot ${selectedItem?.item_id === item.item_id ? 'selected' : ''}`}
                onClick={() => setSelectedItem(item)}
                style={{
                  borderColor: rarityColors[item.rarity],
                  boxShadow:
                    selectedItem?.item_id === item.item_id
                      ? rarityGlow[item.rarity]
                      : 'none',
                }}
              >
                <span className="inventory__item-icon">{item.icon}</span>
              </div>
            ))
          ) : (
            <div className="inventory__empty">
              <p>No items in inventory.</p>
            </div>
          )}
        </div>

        {selectedItem && (
          <div className="inventory__details">
            <div className="inventory__details-header">
              <span className="inventory__details-icon">
                {selectedItem.icon}
              </span>
              <div>
                <h3
                  className="inventory__details-name"
                  style={{ color: rarityColors[selectedItem.rarity] }}
                >
                  {selectedItem.name}
                </h3>
                <span
                  className="inventory__details-rarity"
                  style={{ color: rarityColors[selectedItem.rarity] }}
                >
                  {selectedItem.rarity}
                </span>
              </div>
            </div>
            <p className="inventory__details-desc">{selectedItem.description}</p>
            {selectedItem.flavor_text && (
              <p className="inventory__details-flavor">
                &ldquo;{selectedItem.flavor_text}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
