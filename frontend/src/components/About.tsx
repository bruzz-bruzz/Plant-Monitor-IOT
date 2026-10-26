export default function About() {
    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <h1 className="text-5xl font-extrabold mb-8 text-gray-900 tracking-tight">About Plant IOT</h1>
                
                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Why This Project?</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Tropical plants require specific environmental conditions to thrive. 
                        This dashboard was created to bridge the gap between plant care and technology, 
                        providing real-time visibility into the health of your indoor or greenhouse environment.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">How It Works</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-4">
                        Our IoT sensors collect data on soil moisture, ambient humidity, light intensity, 
                        temperature, soil temperature, and nutrient levels (TDS).
                    </p>
                    <ul className="list-disc list-inside text-lg text-gray-600 space-y-2">
                        <li>Data is processed and analyzed against ideal growth ranges.</li>
                        <li>The dashboard visualizes this data through tables, graphs, and overview cards.</li>
                        <li>Color-coded health indicators make it easy to spot issues at a glance.</li>
                    </ul>
                </section>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                    <a href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                        ← Back to Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
