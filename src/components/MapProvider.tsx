import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"
import { CoordinateType, defaultCoordinates } from "../utils/coordinates.ts"

type ContextType = {
    coordinates: CoordinateType[]
    updateCoordinate: (data: UpdateCoordinateProps) => void
    isEditing: boolean
    setIsEditing: Dispatch<SetStateAction<boolean>>
}

export const MapContext = createContext<ContextType>({} as ContextType)

type Props = {
    children?: ReactNode
}

type UpdateCoordinateProps = {
    coordinateId: number
    status: boolean
    details: string
}

export default function MapProvider({ children }: Props) {
    const [coordinates, setCoordinates] = useState<CoordinateType[]>(
        JSON.parse(localStorage.getItem("coordinates") || "null") || defaultCoordinates
    )
    const [isEditing, setIsEditing] = useState(false)

    const updateCoordinate = ({ coordinateId, status, details }: UpdateCoordinateProps) => {
        const newCoordinates = coordinates.map((coord) => {
            if (coord.id === coordinateId) {
                coord.status = status
                coord.details = details
            }
            return coord
        })

        setCoordinates(newCoordinates)
        localStorage.setItem("coordinates", JSON.stringify(newCoordinates))
    }

    return (
        <MapContext.Provider value={{ coordinates, updateCoordinate, isEditing, setIsEditing }}>
            {children}
        </MapContext.Provider>
    )
}
