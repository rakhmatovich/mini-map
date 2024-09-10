import "ol/ol.css"
import { useRef, useState } from "react"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import MapInitializer from "./MapInitializer"
import Popup from "./MapPopup"
import MapProvider from "./MapProvider.tsx"

export default function MapComponent() {
    const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(null)

    const popupContainerRef = useRef<HTMLDivElement | null>(null)
    const popupCloserRef = useRef<HTMLButtonElement | null>(null)

    return (
        <MapProvider>
            <div className="relative">
                <div id="map" className="map-container w-full h-screen" />

                <MapInitializer
                    setSelectedFeature={setSelectedFeature}
                    popupContainerRef={popupContainerRef}
                    popupCloserRef={popupCloserRef}
                />

                <Popup
                    selectedFeature={selectedFeature}
                    popupContainerRef={popupContainerRef}
                    popupCloserRef={popupCloserRef}
                />
            </div>
        </MapProvider>
    )
}
