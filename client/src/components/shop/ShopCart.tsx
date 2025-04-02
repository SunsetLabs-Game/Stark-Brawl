"use client"

import type { ShopItem } from "@/types/shop-types"
import { renderPrice } from "@/utils/shop-utils"

interface ShopCartProps {
  cartItems: ShopItem[]
  setCartItems: (items: ShopItem[]) => void
  setShowCart: (show: boolean) => void
  toast: any
}

export default function ShopCart({ cartItems, setCartItems, setShowCart, toast }: ShopCartProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-end z-50" onClick={() => setShowCart(false)}>
      <div
        className="bg-gradient-to-br from-purple-900 to-fuchsia-900 h-full w-full max-w-md p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideIn 0.3s ease-out" }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-white mr-2"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h2 className="text-2xl font-bold text-white">Your Cart</h2>
          </div>
          <button
            className="text-white hover:bg-white/10 h-10 w-10 rounded-md flex items-center justify-center"
            onClick={() => setShowCart(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-16 w-16 text-white/30 mb-4"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <p className="text-white/70 text-lg mb-6">Your cart is empty</p>
            <button
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-md"
              onClick={() => setShowCart(false)}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="bg-white/10 rounded-lg p-3 flex items-center">
                  <img
                    src={item.image || "/placeholder.svg?height=60&width=60"}
                    alt={item.name}
                    className="object-contain mr-3 w-[60px] h-[60px]"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=60&width=60"
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{item.name}</h3>
                    <div className="flex justify-between items-center">
                      {renderPrice(item.price, item.priceType, item.discount)}
                      <button
                        className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 rounded-md flex items-center justify-center"
                        onClick={() => {
                          setCartItems(cartItems.filter((_, i) => i !== index))
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M18 6 6 18"></path>
                          <path d="m6 6 12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/20 pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Subtotal</span>
                <span className="text-white font-bold">
                  {cartItems.reduce((total, item) => {
                    if (item.priceType === "gems") return total + item.price
                    return total
                  }, 0)}{" "}
                  Gems
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">ETH Items</span>
                <span className="text-white font-bold">
                  {cartItems.reduce((total, item) => {
                    if (item.priceType === "eth") return total + item.price
                    return total
                  }, 0)}{" "}
                  ETH
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/70">USD Items</span>
                <span className="text-white font-bold">
                  $
                  {cartItems
                    .reduce((total, item) => {
                      if (item.priceType === "usd") return total + item.price
                      return total
                    }, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-6 text-lg font-bold rounded-md"
              onClick={() => {
                toast({
                  title: "Purchase successful!",
                  description: "Thank you for your purchase.",
                })
                setCartItems([])
                setShowCart(false)
              }}
            >
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  )
}

