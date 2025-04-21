import React, { useEffect, useState } from 'react';
import { SignIn } from '@/components/sign-in';


export default function MetricsHome() {
    const [metrics, setMetrics] = useState([{ name: 'Clients', value: 0}]);

    const fetchMetrics = async () => {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setMetrics([
            { name: 'Total Active Clients', value: data.totalClients },
            { name: " Enrollments Last Month", value: data.enrolledClientsPerMonth[data.enrolledClientsPerMonth.length - 1].count },
            { name: " Graduations Last Month", value: data.graduatedClientsPerMonth[data.graduatedClientsPerMonth.length - 1].count },
            { name: " Referrals Last Month", value: data.clientsReferredPerMonth[data.clientsReferredPerMonth.length - 1].count },
        ]);
    }

    useEffect(() => {
        fetchMetrics().then();
    }, []);

    return (
        <div className="bg-white py-14 sm:py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="text-center">
                        <h2 className="text-balance text-8xl font-light uppercase">
                            <span className={`italic font-bold`}><span className={`text-info z-10 relative drop-shadow-lg`}>ED</span><span
                            className={`text-warning -ml-4 mr-0 z-0 relative`}>NAV</span></span> <span className={`text-4xl font-light uppercase block`}>Success Tracker</span>
                        </h2>
                        {/*<p className="mt-4 text-lg/8 text-gray-600">Lorem ipsum dolor sit amet consect adipisicing possimus.</p>*/}
                    </div>
                    <dl className="mt-10 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col bg-gray-400/5 p-8">
                            <dt className="text-sm/6 font-semibold text-gray-600">{'stat.name'}</dt>
                            <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900"><SignIn/></dd>
                        </div>
                        {metrics?.map((stat, i) => (
                            <div key={i} className="flex flex-col bg-gray-400/5 p-8">
                                <dt className="text-sm/6 font-semibold text-gray-600">{stat.name}</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}
