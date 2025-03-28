async function fetchStations() {
    const id = document.getElementById("query_id").value; //get the id
    const resultDiv = document.getElementById("result"); // the resulting div where results are shown

    // Loading animation
    resultDiv.innerHTML = `
        <div class="animate-pulse text-gray-600">
            Loading...
        </div>
    `;

    try {
        const response = await fetch(`http://localhost:1300/station/${id}`); 
        if (!response.ok) {
            throw new Error("Data not found");
        }
        const data = await response.json(); // [{}, {}, {}]

        resultDiv.innerHTML = `
            <pre class="flex flex-col bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                <!-- mapping over stations -->
                ${data.map((station) => {
                    const fields = [
                        { label: 'ID', value: station.station_id },
                        { label: 'Date', value: `${station.date.slice(0, 4)}/${station.date.slice(4, 6)}/${station.date.slice(6, 8)}` },
                        { label: 'Element', value: station.element },
                        { label: 'Data Value', value: station.data_value },
                        { label: 'M-Flag', value: station.m_flag || '-' },
                        { label: 'Q-Flag', value: station.q_flag || '-' },
                        { label: 'S-Flag', value: station.s_flag || '-' },
                        { label: 'OBS_Time', value: station.obs_time || '-' }
                    ];

                    return `
                        <div class="flex bg-white shadow-sm rounded-md p-4 mb-2 items-center space-x-4">
                            <!-- mapping over fields of a particular station -->
                            ${fields.map(field => `
                                <div class="flex items-center">
                                    <span class="font-semibold mr-1">${field.label}:</span>
                                    <span>${field.value}</span>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }).join('')}
            </pre>`
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="text-red-500 bg-red-50 p-4 rounded-lg">
                ${error.message}
            </div>
        `;
    }
} 