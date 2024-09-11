import "ol/ol.css"
import useMap from "../hooks/useMap.ts"
import PopupCloseButton from "./PopupCloseButton.tsx"
import PopupEditButton from "./PopupEditButton.tsx"
import PopupForm from "./PopupForm.tsx"
import { ChangeEvent } from "react"
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style"

export default function MapComponent() {
    const { isEditing, setIsEditing, popupContainerRef, popupCloserRef, selectedFeature, updateCoordinate } = useMap()

    const handleUpdateFeature = (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!selectedFeature) return

        const formData = new FormData(event.target)
        const detailValue = formData.get("detail") as string
        const statusValue = Boolean(formData.get("status"))

        selectedFeature.set("details", detailValue)
        selectedFeature.set("status", statusValue)

        selectedFeature.setStyle(
            new Style({
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({ color: statusValue ? "green" : "red" }),
                    stroke: new Stroke({ color: "white", width: 2 }),
                }),
            })
        )

        updateCoordinate({
            coordinateId: selectedFeature.get("coordinateId"),
            details: detailValue,
            status: statusValue,
        })
        setIsEditing(false)
    }

    return (
        <div className="relative">
            <div id="map" className="map-container w-full h-screen" />

            <div
                ref={popupContainerRef}
                className="min-w-[280px] px-2 py-2 rounded-[10px] border-solid border-[#cccccc] absolute top-3 left-1/2 -translate-x-1/2 flex bg-white gap-2"
            >
                {selectedFeature && (
                    <div className="flex-1" data-test-id="popup">
                        {isEditing ? (
                            <PopupForm
                                details={selectedFeature.get("details")}
                                status={selectedFeature.get("status")}
                                handleSubmit={handleUpdateFeature}
                            />
                        ) : (
                            <p data-test-id="popup-detail">{selectedFeature.get("details")}</p>
                        )}
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <PopupCloseButton popupCloserRef={popupCloserRef} />
                    {!isEditing && <PopupEditButton onClick={() => setIsEditing(true)} />}
                </div>

                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-2">
                    <div className="w-0 h-0 border-x-[20px] border-x-transparent border-b-[20px] border-b-white" />
                    <div className="w-0 h-0 border-x-[21px] border-x-transparent border-b-[21px] border-b-white absolute -left-[1px] -top-[1px]" />
                </div>
            </div>
        </div>
    )
}
