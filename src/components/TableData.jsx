function TableData(props) {
    const { data, headers, actions } = props;
    return (
        <table className='table'>
            <thead>
                <tr>
                    {headers.map((head, index) => (
                        <th key={index}>{head.label}</th>
                    ))}
                </tr>

            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        {/* <td>{item.id}</td>
                    <td>{item.nombre}</td> */}
                        {headers.map((head, index) => (
                            <td key={index}>
                                {item[head.name]}
                            </td>
                        ))}
                        {actions.map((act, index) => (
                            <td key={index}>
                                {act.content(item)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TableData