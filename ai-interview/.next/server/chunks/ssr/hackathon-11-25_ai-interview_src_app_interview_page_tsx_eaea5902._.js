module.exports = [
"[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InterviewPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathon-11-25/ai-interview/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f40$livekit$2f$components$2d$react$2f$dist$2f$room$2d$BH8Rm3Ha$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__L__as__LiveKitRoom$3e$__ = __turbopack_context__.i("[project]/hackathon-11-25/ai-interview/node_modules/@livekit/components-react/dist/room-BH8Rm3Ha.mjs [app-ssr] (ecmascript) <export L as LiveKitRoom>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f40$livekit$2f$components$2d$react$2f$dist$2f$prefabs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathon-11-25/ai-interview/node_modules/@livekit/components-react/dist/prefabs.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathon-11-25/ai-interview/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function InterviewPage() {
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [roomName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>`interview-${Date.now()}`);
    const [participantName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>`user-${Math.random().toString(36).substring(7)}`);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchToken = async ()=>{
            try {
                setIsConnecting(true);
                const response = await fetch("/api/livekit/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        roomName,
                        participantName
                    })
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch token");
                }
                const data = await response.json();
                setToken(data.token);
            } catch (error) {
                console.error("Error fetching token:", error);
                alert("Failed to connect to interview. Please check your LiveKit configuration.");
            } finally{
                setIsConnecting(false);
            }
        };
        fetchToken();
    }, [
        roomName,
        participantName
    ]);
    if (isConnecting || !token) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 text-2xl font-bold",
                        children: "Connecting to Interview..."
                    }, void 0, false, {
                        fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full border-4 border-white border-t-transparent h-12 w-12 mx-auto"
                    }, void 0, false, {
                        fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this);
    }
    const serverUrl = ("TURBOPACK compile-time value", "wss://intervai-bn8nfs5o.livekit.cloud");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen w-screen",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f40$livekit$2f$components$2d$react$2f$dist$2f$room$2d$BH8Rm3Ha$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__L__as__LiveKitRoom$3e$__["LiveKitRoom"], {
            video: true,
            audio: true,
            token: token,
            serverUrl: serverUrl,
            "data-lk-theme": "default",
            style: {
                height: "100dvh"
            },
            onDisconnected: ()=>{
                console.log("Disconnected from room");
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-full flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gradient-to-r from-[#2e026d] to-[#15162c] px-6 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-white",
                                children: "AI Interview"
                            }, void 0, false, {
                                fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-white/80",
                                children: [
                                    "Room: ",
                                    roomName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f40$livekit$2f$components$2d$react$2f$dist$2f$prefabs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VideoConference"], {}, void 0, false, {
                            fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
                            lineNumber: 88,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
                lineNumber: 82,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
            lineNumber: 71,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=hackathon-11-25_ai-interview_src_app_interview_page_tsx_eaea5902._.js.map