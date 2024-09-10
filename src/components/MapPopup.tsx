import Point from "ol/geom/Point"
import { ChangeEvent, RefObject, useContext, useEffect, useState } from "react"
import { Feature } from "ol"
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style"
import { MapContext } from "./MapProvider.tsx"

type Props = {
    selectedFeature: Feature<Point> | null
    popupContainerRef: RefObject<HTMLDivElement>
    popupCloserRef: RefObject<HTMLButtonElement>
}

export default function MapPopup({ selectedFeature, popupContainerRef, popupCloserRef }: Props) {
    const { updateCoordinate, isEditing, setIsEditing } = useContext(MapContext)

    const [editDetails, setEditDetails] = useState("")
    const [editStatus, setEditStatus] = useState(false)

    useEffect(() => {
        if (!selectedFeature || !isEditing) return
        setEditDetails(selectedFeature.get("details"))
        setEditStatus(selectedFeature.get("status"))
    }, [selectedFeature, isEditing])

    const handleUpdateFeature = (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (selectedFeature) {
            selectedFeature.set("details", editDetails)
            selectedFeature.set("status", editStatus)
            selectedFeature.setStyle(
                new Style({
                    image: new CircleStyle({
                        radius: 7,
                        fill: new Fill({ color: editStatus ? "green" : "red" }),
                        stroke: new Stroke({ color: "white", width: 2 }),
                    }),
                })
            )

            updateCoordinate({
                coordinateId: selectedFeature.get("coordinateId"),
                status: editStatus,
                details: editDetails,
            })
            setIsEditing(false)
        }
    }

    return (
        <div
            ref={popupContainerRef}
            className="min-w-[280px] px-4 py-2 rounded-[10px] border-solid border-[#cccccc] absolute top-1 left-1/2 -translate-x-1/2"
        >
            <button ref={popupCloserRef} className="absolute top-3 right-5 text-gray-500 hover:text-gray-700">
                <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g strokeWidth="1"></g>
                    <g strokeLinecap="round" strokeLinejoin="round"></g>
                    <g>
                        <path
                            d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
                            fill="#0F0F0F"
                        ></path>
                    </g>
                </svg>
            </button>

            {!isEditing && (
                <button
                    className="absolute top-8 right-5 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsEditing(true)}
                >
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g strokeWidth="1"></g>
                        <g strokeLinecap="round" strokeLinejoin="round"></g>
                        <g>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z"
                                fill="#0F0F0F"
                            ></path>
                        </g>
                    </svg>
                </button>
            )}

            {selectedFeature && (
                <div className="bg-white rounded pl-3 pr-6 py-2 min-h-12">
                    {isEditing ? (
                        <form onSubmit={handleUpdateFeature}>
                            <div>
                                <label>Details:</label>
                                <textarea
                                    value={editDetails}
                                    onChange={(e) => setEditDetails(e.target.value)}
                                    className="block border rounded px-2 py-1 w-full mb-2"
                                    required
                                />
                            </div>

                            <div>
                                <label>Status:</label>
                                <input
                                    type="checkbox"
                                    checked={editStatus}
                                    onChange={(e) => setEditStatus(e.target.checked)}
                                    className="ml-2"
                                />
                            </div>

                            <button className="mt-2 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700">
                                Update
                            </button>
                        </form>
                    ) : (
                        <p>{selectedFeature.get("details")}</p>
                    )}
                </div>
            )}

            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-2">
                <div className="w-0 h-0 border-x-[10px] border-x-transparent border-b-[10px] border-b-white" />
                <div className="w-0 h-0 border-x-[11px] border-x-transparent border-b-[11px] border-b-white absolute -left-[1px] -top-[1px]" />
            </div>
        </div>
    )
}

// import Feature from "ol/Feature"
// import Point from "ol/geom/Point"
// import { ChangeEvent, MutableRefObject, useEffect, useState } from "react"
// import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style"
//
// type Props = {
//     selectedFeature: Feature<Point>
//     popupContainerRef: MutableRefObject<HTMLDivElement | null>
//     popupCloserRef: MutableRefObject<HTMLButtonElement | null>
// }
//
// export default function MapPopup({ selectedFeature, popupContainerRef, popupCloserRef }: Props) {
//     const [editDetails, setEditDetails] = useState(selectedFeature.get("details"))
//     const [editStatus, setEditStatus] = useState(selectedFeature.get("status"))
//
//     useEffect(() => {
//         setEditDetails(selectedFeature.get("details"))
//         setEditStatus(selectedFeature.get("status"))
//     }, [selectedFeature])
//
//     const handleUpdateFeature = (event: ChangeEvent<HTMLFormElement>) => {
//         event.preventDefault()
//
//         selectedFeature.set("details", editDetails)
//         selectedFeature.set("status", editStatus)
//         selectedFeature.setStyle(
//             new Style({
//                 image: new CircleStyle({
//                     radius: 7,
//                     fill: new Fill({ color: editStatus ? "green" : "red" }),
//                     stroke: new Stroke({ color: "white", width: 2 }),
//                 }),
//             })
//         )
//     }
//
//     return (
//         <div
//             ref={popupContainerRef}
//             className="min-w-[280px] px-4 py-2 rounded-[10px] border-solid border-[#cccccc] absolute top-1 left-1/2 -translate-x-1/2"
//         >
//             <button ref={popupCloserRef} className="absolute top-3 right-5 text-gray-500 hover:text-gray-700">
//                 <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <g strokeWidth="1"></g>
//                     <g strokeLinecap="round" strokeLinejoin="round"></g>
//                     <g>
//                         <path
//                             d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z"
//                             fill="#0F0F0F"
//                         ></path>
//                     </g>
//                 </svg>
//             </button>
//
//             <button className="absolute top-8 right-5 text-gray-500 hover:text-gray-700">
//                 <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <g strokeWidth="1"></g>
//                     <g strokeLinecap="round" strokeLinejoin="round"></g>
//                     <g>
//                         <path
//                             fillRule="evenodd"
//                             clipRule="evenodd"
//                             d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z"
//                             fill="#0F0F0F"
//                         ></path>
//                     </g>
//                 </svg>
//             </button>
//
//             <form className="bg-white rounded pl-3 pr-6 py-2 min-h-12" onSubmit={handleUpdateFeature}>
//                 <div>
//                     <label>Details:</label>
//                     <input
//                         type="text"
//                         value={editDetails}
//                         onChange={(e) => setEditDetails(e.target.value)}
//                         className="block border rounded px-2 py-1 w-full mb-2"
//                         required
//                     />
//                 </div>
//
//                 <div>
//                     <label>Status:</label>
//                     <input
//                         type="checkbox"
//                         checked={editStatus}
//                         onChange={(e) => setEditStatus(e.target.checked)}
//                         className="ml-2"
//                         required
//                     />
//                 </div>
//
//                 <button className="mt-2 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700">Update</button>
//
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-2">
//                     <div className="w-0 h-0 border-x-[10px] border-x-transparent border-b-[10px] border-b-white" />
//                     <div className="w-0 h-0 border-x-[11px] border-x-transparent border-b-[11px] border-b-white absolute -left-[1px] -top-[1px]" />
//                 </div>
//             </form>
//         </div>
//     )
// }
