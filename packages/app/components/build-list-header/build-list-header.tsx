export function BuildListHeader() {
    return (
        <tr>
            <th
                className='px-8 py-2 max-w-24'
            >
                Status
            </th>

            <th
                className='px-8 py-2 max-w-64'
            >
                Branch
            </th>

            <th
                className='px-8 py-2 max-w-48'
            >
                Author
            </th>

            <th
                className='px-8 py-2 min-w-96'
            >
                Commit subject
            </th>

            <th
                className='px-8 py-2 max-w-32'
            >
                Trigger
            </th>

            <th
                className='px-8 py-2 max-w-24'
            >
                Origin
            </th>

            <th
                className='px-8 py-2 max-w-32'
            >
                Commit
            </th>

            <th
                className='px-8 py-2 max-w-64'
            >
                Started
            </th>

            <th
                className='px-8 py-2 max-w-40'
            >
                Duration
            </th>

            <th
                className='px-8 py-2 max-w-32'
            >
                Details
            </th>


        </tr>
    );
}