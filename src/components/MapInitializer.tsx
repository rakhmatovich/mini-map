import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import OSM from "ol/source/OSM"
import Overlay from "ol/Overlay"
import Point from "ol/geom/Point"
import Feature, { FeatureLike } from "ol/Feature"
import { RefObject, useContext, useEffect } from "react"
import { Map, View } from "ol"
import { fromLonLat } from "ol/proj"
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style"
import { MapContext } from "./MapProvider.tsx"

type Props = {
    setSelectedFeature: (feature: Feature<Point> | null) => void
    popupContainerRef: RefObject<HTMLDivElement>
    popupCloserRef: RefObject<HTMLButtonElement>
}

export default function MapInitializer({ setSelectedFeature, popupContainerRef, popupCloserRef }: Props) {
    const { coordinates, setIsEditing } = useContext(MapContext)

    useEffect(() => {
        const osmLayer = new TileLayer({
            preload: Infinity,
            source: new OSM(),
        })

        const vectorSource = new VectorSource()

        coordinates.forEach((coord) => {
            const pointFeature = new Feature({
                geometry: new Point(fromLonLat([coord.longitude, coord.latitude])),
                details: coord.details,
                status: coord.status,
                coordinateId: coord.id,
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

        olMap.getView().fit(vectorSource.getExtent(), { padding: [50, 50, 50, 50] })

        const overlay = new Overlay({
            element: popupContainerRef.current!,
            autoPan: true,
        })

        olMap.addOverlay(overlay)

        olMap.on("singleclick", function (event) {
            overlay.setPosition(undefined)

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
    }, [popupContainerRef, popupCloserRef, setSelectedFeature])

    return null
}
