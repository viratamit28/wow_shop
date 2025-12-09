import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import video from "../video/Video_tour.mp4";

// ==================== ALL LAYOUTS ====================
const kitchenLayouts = [
  {
    id: 1,
    name: "L-Shaped Kitchen",
    fancyName: "The Corner Masterpiece",
    image: require("../assests/layouts/L-shaped.jpg"),
    videoUrl: video,
    positions: [
      { x: 27, y: 27, name: "Chimney" },
      { x: 32, y: 55, name: "Hob" },
      { x: 82, y: 55, name: "Oven" },
      { x: 51, y: 55, name: "Sink" },
      { x: 82, y: 30, name: "Referigerators" },
    ],
  },
  {
    id: 2,
    name: "U-Shaped Kitchen",
    fancyName: "The Ultimate Triangle",
    image: require("../assests/layouts/U-shaped.jpg"),
    videoUrl: video,
    positions: [
      { x: 27, y: 27, name: "Chimney" },
      { x: 32, y: 55, name: "Hob" },
      { x: 82, y: 55, name: "Oven" },
      { x: 51, y: 55, name: "Sink" },
      { x: 82, y: 30, name: "Referigerators" },
    ],
  },
  {
    id: 3,
    name: "Galley Kitchen",
    image: require("../assests/layouts/Galley-shaped.jpg"),
    videoUrl: video,
    positions: [{ x: 50, y: 50, name: "Central Zone" }],
  },
  {
    id: 4,
    name: "One Wall Kitchen",
    image: require("../assests/layouts/Onewall-shaped.jpg"),
    videoUrl: video,
    positions: [{ x: 50, y: 50, name: "Central Zone" }],
  },
  {
    id: 5,
    name: "Penisula Kitchen",
    image: require("../assests/layouts/Penisula-shaped.jpg"),
    videoUrl: video,
    positions: [{ x: 50, y: 50, name: "Central Zone" }],
  },
  {
    id: 6,
    name: "Island Kitchen",
    image: require("../assests/layouts/Island-shaped.jpeg"),
    videoUrl: video,
    positions: [{ x: 50, y: 50, name: "Central Zone" }],
  },
];

// ==================== ALL APPLIANCES ====================
const appliancesData = [
  {
    id: 1,
    name: "Samsung French Door Refrigerator",
    price: 129900,
    image:
      "https://images.samsung.com/is/image/samsung/p6pim/in/rs78cg8543s9hl/energylabel/in-energylabel-product-rs78cg8543s9hl-549428104?$684_547_PNG$",
    zone: "Referigerators",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 2,
    name: "LG InstaView Door-in-Door",
    price: 159999,
    image:
      "https://dimensiva.com/wp-content/uploads/edd/2022/09/instaview-door-in-door-fridge-freezer-2022-by-lg.jpg",
    zone: "Referigerators",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 3,
    name: "Whirlpool Side-by-Side",
    price: 109999,
    image:
      "http://shrikantelectronics.com/cdn/shop/files/w-series-side-by-side-603l-crystal-gold-1000x1000_98964dca-95a1-4102-bd6b-5ad60ac77000_1200x1200.jpg?v=1726918536",
    zone: "Referigerators",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 4,
    name: "GE Profile Cooktop",
    price: 89999,
    image:
      "https://crdms.images.consumerreports.org/f_auto,w_600/prod/products/cr/models/394345-gascooktops-ge-profilepgp9036slss.png",
    zone: "Hob",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 5,
    name: "Wolf Gas Range",
    price: 249999,
    image:
      "https://dzrf1tezfwb3j.cloudfront.net/uploads/images/AImages/14625/dynamic_gr366-2019-08-28-01-32-36.png",
    zone: "Hob",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 6,
    name: "KitchenAid Induction Cooktop",
    price: 119999,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCWQdThhLwGDYFnardiwXtTXX1L1fPZUQgfw&s",
    zone: "Hob",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 7,
    name: "Bosch Dishwasher",
    price: 74999,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRabWyRenaoG1A0E14UEyFIOWGoQJCDasInkA&s",
    zone: "Sink",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 8,
    name: "Miele Built-in Dishwasher",
    price: 129999,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8YyffXyCMh8Jv03toAJyyYp6tNBqP8LFFng&s",
    zone: "Sink",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 9,
    name: "LG Over-the-Range Microwave",
    price: 34999,
    image: "https://m.media-amazon.com/images/I/71SZQyN44qL._SX679_.jpg",
    zone: "Oven",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 10,
    name: "Samsung Countertop Microwave",
    price: 19999,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_0NNCrSNnlITAX8xJj1wnARsfwpNaUEEXpg&s",
    zone: "Oven",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 11,
    name: "Wolf Wall Oven",
    price: 219999,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScYZsIlnYUFQO6nD-XKJDs54lewFnT_rVJ-g&s",
    zone: "Oven",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 12,
    name: "GE Double Wall Oven",
    price: 179999,
    image:
      "https://m.media-amazon.com/images/I/61ai3dnm5AL.jpg_BO30,255,255,255_UF900,850_SR1910,1000,0,C_QL100_.jpg",
    zone: "Oven",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 13,
    name: "Kohler Stainless Steel Sink",
    price: 39999,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwGAsi7fkZOHVhNUsHE7iJ-yWPRr3j1SCBIg&s",
    zone: "Sink",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 14,
    name: "Moen MotionSense Faucet",
    price: 29999,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR85iBC_KvRv70jWqkZv_smdNPfBmDlwdlV9g&s",
    zone: "Sink",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 15,
    name: "NEWBURY 90 DC Chimney",
    price: 89999,
    image:
      "https://decure.in/cdn/shop/files/chi_kaf_brando_90_dc_bldc_f73061cc-44bc-4e3a-9711-95dce74eea7c.jpg?v=1735987881&width=990",
    zone: "Chimney",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 16,
    name: "BASE BF 60 - Kitchen Chimney",
    price: 14999,
    image:
      "https://cdn.shopify.com/s/files/1/0932/4816/0107/files/BASE-BF-60-BLK-4.webp?v=1758783107",
    zone: "Chimney",
    layoutId: [1, 2, 3, 4, 5, 6],
  },
];

// ==================== MAIN COMPONENT ====================
export default function ChooseLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedAppliances, setSelectedAppliances] = useState([]);
  const [activeZone, setActiveZone] = useState(null);
  const [showProductList, setShowProductList] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showScrollNotification, setShowScrollNotification] = useState(false);

  const selectedLayout = kitchenLayouts.find((l) => l.id === parseInt(id));
  if (!selectedLayout)
    return (
      <div className="text-white text-center pt-32 text-3xl">
        Layout not found
      </div>
    );

  const relatedAppliances = appliancesData.filter((a) =>
    a.layoutId.includes(parseInt(id))
  );

  const handleSelectAppliance = (appliance) => {
    setSelectedAppliances((prev) => {
      const exists = prev.find((i) => i.id === appliance.id);
      if (!exists) {
        setShowScrollNotification(true);
        setTimeout(() => setShowScrollNotification(false), 4000);
      }
      return exists
        ? prev.filter((i) => i.id !== appliance.id)
        : [...prev, appliance];
    });
  };

  const handleAddToCart = (appliance) => {
    alert(`${appliance.name} added to cart!`);
  };

  const getAppliancesForZone = (zoneName) =>
    relatedAppliances.filter((a) => a.zone === zoneName);

  // ==================== POSITION POINT WITH "VIEW ALL" BUTTON ====================
  const PositionPoint = ({ point, index }) => {
    const zoneAppliances = getAppliancesForZone(point.name);
    const isActive = activeZone === index;
    const shouldHide = showProductList && !isActive;

    return (
      <div
        className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all z-30 ${
          shouldHide ? "opacity-0" : "opacity-100"
        }`}
        style={{ left: `${point.x}%`, top: `${point.y}%` }}
        onMouseEnter={() => !showProductList && setHoveredPoint(index)}
        onMouseLeave={() => setHoveredPoint(null)}
        onClick={() => {
          if (activeZone === index && showProductList) {
            setShowProductList(false);
            setActiveZone(null);
          } else {
            setActiveZone(index);
            setShowProductList(true);
          }
        }}
      >
        {/* Glowing Dot */}
        <div className="relative">
          <div
            className={`absolute inset-0 w-14 h-14 rounded-full border-4 ${
              isActive ? "border-green-400" : "border-yellow-400"
            } animate-ping opacity-70`}
          />
          <div
            className={`relative w-12 h-12 rounded-full border-4 border-white shadow-2xl flex items-center justify-center font-bold text-lg ${
              isActive ? "bg-green-500 scale-125" : "bg-yellow-400"
            }`}
          >
            {index + 1}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredPoint === index && !showProductList && (
          <div className="absolute left-1/2 -top-12 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap z-40">
            {point.name}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
          </div>
        )}

        {/* Popup with Products + View All Button */}
        {isActive && showProductList && (
          <div className="absolute left-1/2 top-full mt-6 -translate-x-1/2 w-96 bg-white rounded-2xl shadow-2xl border z-50">
            {/* Header */}
            <div className="bg-black text-white p-4 flex justify-between items-center rounded-t-2xl">
              <span className="text-yellow-400 font-bold">
                Best for {point.name}
              </span>
              <button
                onClick={() => {
                  setShowProductList(false);
                  setActiveZone(null);
                }}
                className="text-3xl hover:text-gray-300"
              >
                ×
              </button>
            </div>

            {/* Products List */}
            <div className="max-h-96 overflow-y-auto">
              {zoneAppliances.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 border-b flex gap-4 hover:bg-gray-50 ${
                    selectedAppliances.find((s) => s.id === p.id)
                      ? "bg-green-50"
                      : ""
                  }`}
                >
                  <img
                    src={p.image}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{p.name}</h4>
                    <p className="text-green-600 font-bold text-lg">
                      ₹{p.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAppliance(p);
                      }}
                      className={`px-5 py-2 rounded-lg font-bold text-sm ${
                        selectedAppliances.find((s) => s.id === p.id)
                          ? "bg-green-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {selectedAppliances.find((s) => s.id === p.id)
                        ? "Selected"
                        : "Select"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      className="px-5 py-2 bg-yellow-500 text-black rounded-lg font-bold text-sm hover:bg-yellow-600"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* VIEW ALL BUTTON — AB SAHI JAGAH PE HAI! */}
            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  const allZoneProducts = appliancesData.filter(
                    (a) => a.zone === point.name
                  );
                  navigate("/view-all-products", {
                    state: {
                      zoneName: point.name,
                      zoneProducts: allZoneProducts,
                    },
                  });
                  setShowProductList(false);
                  setActiveZone(null);
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold text-base flex items-center gap-2 group"
              >
                <span className="border-b-2 border-blue-600 group-hover:border-blue-700 pb-1">
                  View all{" "}
                  {point.name === "Referigerators"
                    ? "Refrigerators"
                    : point.name}
                </span>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                  {appliancesData.filter((a) => a.zone === point.name).length}
                </span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== RETURN (UI) ====================
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Full Screen Image */}
      <div className="relative w-full h-screen">
        <img
          src={selectedLayout.image}
          alt={selectedLayout.name}
          className="w-full h-full object-cover"
        />
        {selectedLayout.positions.map((pos, i) => (
          <PositionPoint key={i} point={pos} index={i} />
        ))}

        {/* Video Tour Button */}
        <button
          onClick={() => setIsVideoOpen(true)}
          className="absolute top-16 right-6 z-40 bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-8 rounded-full flex items-center gap-3 transition-all hover:scale-110 shadow-2xl"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="text-lg">Get Instant 3D Tour</span>
        </button>
      </div>

      {/* Scroll Down Notification */}
      {showScrollNotification && selectedAppliances.length > 0 && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate-pulse">
          <div className="bg-black/90 backdrop-blur-md text-white px-10 py-6 rounded-full shadow-2xl border-2 border-yellow-500 flex items-center gap-6">
            <svg
              className="w-8 h-8 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeWidth={4}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <span className="font-bold text-xl">
              {selectedAppliances.length} item
              {selectedAppliances.length > 1 ? "s" : ""} added
            </span>
            <span className="text-yellow-400 font-bold animate-pulse">
              ↓ Scroll down to see ↓
            </span>
            <svg
              className="w-8 h-8 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeWidth={4}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Selected Items Section */}
      {selectedAppliances.length > 0 && (
        <div className="bg-white text-black py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold">
                Your Selection ({selectedAppliances.length})
              </h2>
              <button
                onClick={() => navigate("/cart")}
                className="bg-black text-white px-12 py-5 rounded-xl font-bold text-lg hover:bg-gray-900 transition"
              >
                Proceed to Cart
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {selectedAppliances.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-3">{item.zone}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-bold text-2xl">
                        ₹{item.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleSelectAppliance(item)}
                        className="text-red-500 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-16 right-0 text-white text-6xl hover:text-gray-400"
            >
              ×
            </button>
            <video className="w-full rounded-3xl shadow-2xl" controls autoPlay>
              <source src={selectedLayout.videoUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
}
