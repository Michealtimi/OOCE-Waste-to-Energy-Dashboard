(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/waste-to-energy-dashboard (2)/context/waste-data-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LGAS",
    ()=>LGAS,
    "PSP_OPERATORS",
    ()=>PSP_OPERATORS,
    "WASTE_TYPES",
    ()=>WASTE_TYPES,
    "WasteDataProvider",
    ()=>WasteDataProvider,
    "useWasteData",
    ()=>useWasteData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$waste$2d$to$2d$energy$2d$dashboard__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/waste-to-energy-dashboard (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$waste$2d$to$2d$energy$2d$dashboard__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/waste-to-energy-dashboard (2)/node_modules/.pnpm/next@16.0.7_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const WasteDataContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$waste$2d$to$2d$energy$2d$dashboard__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const LGAS = [
    "Agege",
    "Ajeromi-Ifelodun",
    "Alimosho",
    "Amuwo-Odofin",
    "Apapa",
    "Badagry",
    "Epe",
    "Eti-Osa",
    "Ibeju-Lekki",
    "Ifako-Ijaaye",
    "Ikeja",
    "Ikorodu",
    "Kosofe",
    "Lagos Island",
    "Lagos Mainland",
    "Mushin",
    "Ojo",
    "Oshodi-Isolo",
    "Shomolu",
    "Surulere"
];
const PSP_OPERATORS = [
    "CleanLagos Services",
    "EcoWaste Management",
    "GreenCity Collectors",
    "WasteNet Solutions",
    "Urban Sanitation Ltd"
];
const WASTE_TYPES = [
    "Organic",
    "Plastic",
    "Mixed",
    "Inert"
];
function generateMockData() {
    const submissions = [];
    const today = new Date();
    for(let i = 0; i < 50; i++){
        const daysAgo = Math.floor(Math.random() * 14);
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);
        const tons = Math.round((Math.random() * 50 + 10) * 10) / 10;
        const energyKWh = tons * 650;
        const carbonCredits = tons * 0.42;
        submissions.push({
            id: `mock-${i + 1}`,
            date: date.toISOString().split("T")[0],
            lga: LGAS[Math.floor(Math.random() * LGAS.length)],
            pspOperator: PSP_OPERATORS[Math.floor(Math.random() * PSP_OPERATORS.length)],
            tons,
            wasteType: WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)],
            energyKWh,
            carbonCredits
        });
    }
    return submissions;
}
function WasteDataProvider({ children }) {
    _s();
    const [submissions, setSubmissions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$waste$2d$to$2d$energy$2d$dashboard__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const initializeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$waste$2d$to$2d$energy$2d$dashboard__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WasteDataProvider.useCallback[initializeData]": async ()=>{
            try {
                // 1. Generate mock data
                let mockData = generateMockData(); // Keep mock data as a fallback
                // 2. Fetch real, persisted submissions
                const res = await fetch("/api/submit");
                // Added console.error for better debugging if API fails
                if (!res.ok) {
                    console.error(`API fetch failed with status: ${res.status}`);
                    // If API fails, we still want to use mock data
                    throw new Error("Failed to fetch persisted data from API.");
                }
                const persistedData = await res.json();
                // 3. Combine and set the state, sorting by date
                const combinedData = [
                    ...persistedData.submissions,
                    ...mockData
                ].sort({
                    "WasteDataProvider.useCallback[initializeData].combinedData": (a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime()
                }["WasteDataProvider.useCallback[initializeData].combinedData"]);
                setSubmissions(combinedData);
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
                // Fallback to just mock data if API fails
                setSubmissions(generateMockData());
            }
        }
    }["WasteDataProvider.useCallback[initializeData]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$waste$2d$to$2d$energy$2d$dashboard__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WasteDataProvider.useEffect": ()=>{
            initializeData();
        }
    }["WasteDataProvider.useEffect"], [
        initializeData
    ]);
    const addSubmission = async (submission)=>{
        console.log({
            payload: submission
        });
        try {
            console.log("Attempting to submit data:", submission);
            const res = await fetch("/api/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(submission)
            });
            // Improved error handling for non-OK responses. This will now log the actual HTML "Not Found" page content if the 404 persists,
            // which is useful for debugging if the API route is still not found.
            // This is crucial for debugging the 404.
            if (!res.ok) {
                console.log({
                    res
                });
                const errorBody = await res.text();
                console.error("API submission response not OK:", res.status, errorBody); // Log the full response body
                throw new Error(`API submission failed with status ${res.status}: ${errorBody.substring(0, 200)}...`); // Truncate for error message
            }
            const result = await res.json();
            console.log("Submission successful, received:", result);
            setSubmissions((prev)=>[
                    result.data,
                    ...prev
                ]);
        } catch (error) {
            console.error("Failed to add submission:", error);
            throw error // Re-throw to allow calling component to handle
            ;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$waste$2d$to$2d$energy$2d$dashboard__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WasteDataContext.Provider, {
        value: {
            submissions,
            addSubmission
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/waste-to-energy-dashboard (2)/context/waste-data-context.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_s(WasteDataProvider, "3oXL2FAMvECvM0UAZ/fOAe1tin0=");
_c = WasteDataProvider;
function useWasteData() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$waste$2d$to$2d$energy$2d$dashboard__$28$2$292f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$7_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(WasteDataContext);
    if (context === undefined) {
        throw new Error("useWasteData must be used within a WasteDataProvider");
    }
    return context;
}
_s1(useWasteData, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "WasteDataProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=waste-to-energy-dashboard%20%282%29_context_waste-data-context_tsx_37ca5267._.js.map