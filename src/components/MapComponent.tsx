import { useEffect, useRef, useState } from "react"
import { Map, View } from "ol"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import OSM from "ol/source/OSM"
import { fromLonLat } from "ol/proj"
import Feature, { FeatureLike } from "ol/Feature"
import Point from "ol/geom/Point"
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style"
import Overlay from "ol/Overlay"
import { Coordinate, coordinates } from "../utils/coordinates.ts"
import "ol/ol.css"

export default function MapComponent() {
    const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(null)

    const popupContainerRef = useRef<HTMLDivElement | null>(null)
    const popupCloserRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        })

        const vectorSource = new VectorSource()

        coordinates.forEach((coord: Coordinate) => {
            const pointFeature = new Feature({
                geometry: new Point(fromLonLat([coord.longitude, coord.latitude])),
                details: coord.details,
                status: coord.status,
            })

            pointFeature.setStyle(
                new Style({
                    image: new CircleStyle({
                        radius: 7,
                        fill: new Fill({ color: coord.status ? "green" : "red" }),
                        stroke: new Stroke({ color: "white", width: 2 }),
                    }),
                })
            )

            vectorSource.addFeature(pointFeature)
        })

        const vectorLayer = new VectorLayer({
            source: vectorSource,
        })

        const olMap = new Map({
            target: "map",
            layers: [osmLayer, vectorLayer],
            view: new View({
                center: fromLonLat([58.674264, 25.543009]),
                zoom: 5,
            }),
        })

        // Fit map to show all points
        olMap.getView().fit(vectorSource.getExtent(), { padding: [50, 50, 50, 50] })

        // Popup setup using refs
        const overlay = new Overlay({
            element: popupContainerRef.current!,
            autoPan: true,
        })

        olMap.addOverlay(overlay)

        olMap.on("singleclick", function (event) {
            olMap.forEachFeatureAtPixel(event.pixel, function (feature: FeatureLike) {
                if (feature instanceof Feature && feature.getGeometry() instanceof Point) {
                    const geometry = feature.getGeometry() as Point // Cast to Point
                    const coordinates = geometry.getCoordinates() // Now getCoordinates works

                    if (coordinates) {
                        setSelectedFeature(feature as Feature<Point>)
                        overlay.setPosition(coordinates)
                    }
                }
            })
        })

        popupCloserRef.current!.onclick = function () {
            overlay.setPosition(undefined)
            popupCloserRef.current!.blur()
            return false
        }

        return () => olMap.setTarget(undefined)
    }, [])

    return (
        <div className="relative">
            <div id="map" className="map-container w-full h-screen" />
            <div
                ref={popupContainerRef}
                className="min-w-[280px] px-4 py-2 rounded-[10px] border-solid border-[#cccccc] absolute top-1 left-1/2 -translate-x-1/2"
            >
                <button ref={popupCloserRef} className="absolute top-2 right-5 text-gray-500 hover:text-gray-700">
                    ✖
                </button>

                <div>
                    {selectedFeature && (
                        <div className="bg-white rounded px-3 py-2">
                            <p>Details: {selectedFeature.get("details")}</p>
                            {/* Implement form or additional editing here */}
                        </div>
                    )}
                </div>

                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-2">
                    <div className="w-0 h-0 border-x-[10px] border-x-transparent border-b-[10px] border-b-white" />
                    <div className="w-0 h-0 border-x-[11px] border-x-transparent border-b-[11px] border-b-white absolute -left-[1px] -top-[1px]" />
                </div>
            </div>
        </div>
    )
}
