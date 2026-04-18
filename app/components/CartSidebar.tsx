"use client";

import { useCart } from "../../lib/cartStore";
import Image from "next/image";
import { useState } from "react";

export default function CartSidebar() {
  const { items, removeItem, updateQty, total, count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Cart button in nav */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
      >
        Cart
        {count() > 0 && (
          <span className="bg-white text-emerald-700 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {count()}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="text-base font-medium">
            Your cart ({count()} items)
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <div className="text-4xl mb-3">🌿</div>
            <div className="text-sm">Your cart is empty</div>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto h-[calc(100vh-200px)] px-5 py-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 mb-4 pb-4 border-b border-gray-100"
                >
                  <div
                    style={{ position: "relative", width: "64px", height: "64px" }}
                    className="bg-emerald-50 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {item.brand}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            item.qty === 1
                              ? removeItem(item.id)
                              : updateQty(item.id, item.qty - 1)
                          }
                          className="px-2 py-1 text-gray-500 hover:bg-gray-50 text-sm"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-50 text-sm"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t border-gray-100 bg-white">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-base font-medium">
                  ${total().toFixed(2)}
                </span>
              </div>
              <button className="w-full bg-emerald-600 text-white font-medium py-3 rounded-xl">
                Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}