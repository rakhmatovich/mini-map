import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import OSM from "ol/source/OSM"
import Overlay from "ol/Overlay"
import Point from "ol/geom/Point"
import Feature, { FeatureLike } from "ol/Feature"
import { useEffect, useRef, useState } from "react"
import { Map, View } from "ol"
import { fromLonLat } from "ol/proj"
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style"
import { CoordinateType, defaultCoordinates } from "../utils/coordinates.ts"

type UpdateCoordinateProps = {
    coordinateId: number
    status: boolean
    details: string
}

export default function useMap() {
    const [coordinates, setCoordinates] = useState<CoordinateType[]>(
        JSON.parse(localStorage.getItem("coordinates") || "null") || defaultCoordinates
    )
    const [isEditing, setIsEditing] = useState(false)
    const [selectedFeature, setSelectedFeature] = useState<Feature<Point> | null>(null)

    const popupContainerRef = useRef<HTMLDivElement | null>(null)
    const popupCloserRef = useRef<HTMLButtonElement | null>(null)

    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        })

        const vectorSource = new VectorSource()

        coordinates.forEach((coordinate) => {
            const pointFeature = new Feature({
                geometry: new Point(fromLonLat([coordinate.longitude, coordinate.latitude])),
                details: coordinate.details,
                status: coordinate.status,
                coordinateId: coordinate.id,
            })

            pointFeature.setStyle(
                new Style({
                    image: new CircleStyle({
                        radius: 7,
                        fill: new Fill({ color: coordinate.status ? "green" : "red" }),
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

        olMap.getView().fit(vectorSource.getExtent(), { padding: [50, 50, 50, 50] })

        const overlay = new Overlay({
            element: popupContainerRef.current!,
            autoPan: true,
        })

        olMap.addOverlay(overlay)

        olMap.on("singleclick", function (event) {
            overlay.setPosition(undefined)
            setIsEditing(false)

            olMap.forEachFeatureAtPixel(event.pixel, function (feature: FeatureLike) {
                if (feature instanceof Feature && feature.getGeometry() instanceof Point) {
                    const geometry = feature.getGeometry() as Point
                    const coordinates = geometry.getCoordinates()

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
            setIsEditing(false)
            return false
        }

        return () => olMap.setTarget(undefined)
    }, [])

    const updateCoordinate = ({ coordinateId, status, details }: UpdateCoordinateProps) => {
        const newCoordinates = coordinates.map((coordinate) => {
            if (coordinate.id === coordinateId) {
                coordinate.status = status
                coordinate.details = details
            }
            return coordinate
        })

        setCoordinates(newCoordinates)
        localStorage.setItem("coordinates", JSON.stringify(newCoordinates))
    }

    return {
        coordinates,
        updateCoordinate,
        isEditing,
        setIsEditing,
        popupContainerRef,
        popupCloserRef,
        setSelectedFeature,
        selectedFeature,
    }
}
