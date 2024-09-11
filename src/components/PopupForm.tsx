import { ChangeEvent, useState } from "react"

type Props = {
    handleSubmit: (event: ChangeEvent<HTMLFormElement>) => void
    details: string
    status: boolean
}

export default function PopupForm({ handleSubmit, details, status }: Props) {
    const [detailValue, setDetailValue] = useState(details)
    const [statusValue, setStatusValue] = useState(status)

    return (
        <form onSubmit={handleSubmit} data-test-id="update-form">
            <div>
                <label htmlFor="detail">Details:</label>
                <textarea
                    data-test-id="popup-detail"
                    id="detail"
                    name="detail"
                    value={detailValue}
                    onChange={(e) => setDetailValue(e.target.value)}
                    className="block border rounded px-2 py-1 w-full mb-2"
                    required
                />
            </div>

            <div>
                <label htmlFor="status">Status:</label>
                <input
                    data-test-id="popup-status"
                    id="status"
                    name="status"
                    type="checkbox"
                    checked={statusValue}
                    onChange={(e) => setStatusValue(e.target.checked)}
                    className="ml-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
            </div>

            <button className="mt-2 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700">Update</button>
        </form>
    )
}
