function TableData(props) {
    const { data, headers, actions } = props;
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-100 pb-5">
            <table className="table w-full">
                <thead className="bg-gray-200 border-b-2 border-gray-300">
                    <tr>
                        {headers.map((head, index) => (
                            <th key={index} className="px-2 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                                {head.label}
                            </th>
                        ))}
                        {actions && actions.length > 0 && (
                            <th className="px-2 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                Gestión
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                            {headers.map((head, index) => (
                                <td key={index} className="px-2 py-2 text-sm text-gray-700 break-words whitespace-normal align-middle">
                                    {head.render ? head.render(item) : item[head.name]}
                                </td>
                            ))}
                            {actions && actions.length > 0 && (
                                <td className="px-2 py-2 whitespace-nowrap align-middle">
                                    <div className="flex items-center justify-center gap-2">
                                        {actions.map((act, index) => (
                                            <div key={index}>
                                                {act.content(item)}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableData