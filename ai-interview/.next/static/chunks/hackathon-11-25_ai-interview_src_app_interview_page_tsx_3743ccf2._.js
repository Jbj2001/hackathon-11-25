(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InterviewPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/hackathon-11-25/ai-interview/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathon-11-25/ai-interview/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f40$livekit$2f$components$2d$react$2f$dist$2f$room$2d$BH8Rm3Ha$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__L__as__LiveKitRoom$3e$__ = __turbopack_context__.i("[project]/hackathon-11-25/ai-interview/node_modules/@livekit/components-react/dist/room-BH8Rm3Ha.mjs [app-client] (ecmascript) <export L as LiveKitRoom>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f40$livekit$2f$components$2d$react$2f$dist$2f$prefabs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathon-11-25/ai-interview/node_modules/@livekit/components-react/dist/prefabs.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hackathon-11-25/ai-interview/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function InterviewPage() {
    _s();
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [roomName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "InterviewPage.useState": ()=>"interview-".concat(Date.now())
    }["InterviewPage.useState"]);
    const [participantName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "InterviewPage.useState": ()=>"user-".concat(Math.random().toString(36).substring(7))
    }["InterviewPage.useState"]);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InterviewPage.useEffect": ()=>{
            const fetchToken = {
                "InterviewPage.useEffect.fetchToken": async ()=>{
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
                }
            }["InterviewPage.useEffect.fetchToken"];
            fetchToken();
        }
    }["InterviewPage.useEffect"], [
        roomName,
        participantName
    ]);
    if (isConnecting || !token) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 text-2xl font-bold",
                        children: "Connecting to Interview..."
                    }, void 0, false, {
                        fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen w-screen",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f40$livekit$2f$components$2d$react$2f$dist$2f$room$2d$BH8Rm3Ha$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__L__as__LiveKitRoom$3e$__["LiveKitRoom"], {
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
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-full flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gradient-to-r from-[#2e026d] to-[#15162c] px-6 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-white",
                                children: "AI Interview"
                            }, void 0, false, {
                                fileName: "[project]/hackathon-11-25/ai-interview/src/app/interview/page.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$hackathon$2d$11$2d$25$2f$ai$2d$interview$2f$node_modules$2f40$livekit$2f$components$2d$react$2f$dist$2f$prefabs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VideoConference"], {}, void 0, false, {
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
_s(InterviewPage, "R1Xsd7XyClnZrA2V6phpEwK0CGw=");
_c = InterviewPage;
var _c;
__turbopack_context__.k.register(_c, "InterviewPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=hackathon-11-25_ai-interview_src_app_interview_page_tsx_3743ccf2._.js.map