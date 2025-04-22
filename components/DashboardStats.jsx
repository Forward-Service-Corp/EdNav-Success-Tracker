import SignIn from './sign-in';
import React from 'react';

export default function DashboardStats({metrics, loading}) {

    return (
        loading ? <div>Loading...</div> : (
          <dl className="mx-auto flex justify-center items-center  h-full divide-x divide-base-content">

                <div
                    className="flex flex-wrap flex-1/4 h-auto items-center text-center justify-center gap-x-0 gap-y-0 px-4 sm:px-6 xl:px-8  text-base-content"
                >
                  <dd
                    className="  flex-none text-3xl text-center font-medium text-base-content">{metrics.referrals[0].count}</dd>
                  <dt className="text-center ">Referred</dt>
                  <span className={` -mt-1`}>last month</span>
                    <SignIn/>
                </div>

                <div
                    className="flex flex-wrap flex-1/4 h-auto items-center text-center justify-center gap-x-0 gap-y-0 px-4 sm:px-6 xl:px-8  text-base-content"
                >
                  <dd className="  flex-none text-3xl text-center font-medium text-base-content">GitHub</dd>
                  <dt className="text-center ">Referred</dt>
                  <span className={` -mt-1`}>last month</span>
                    <SignIn/>
                </div>

                <div
                    className="flex flex-wrap flex-1/4 h-auto items-center text-center justify-center gap-x-0 gap-y-0 px-4 sm:px-6 xl:px-8  text-base-content"
                >
                  <dd
                    className="  flex-none text-3xl text-center font-medium text-base-content">{metrics.graduations[0].count}</dd>
                  <dt className="text-center ">Graduations</dt>
                  <span className={` -mt-1`}>last month</span>
                </div>

                <div
                    className="flex flex-wrap flex-1/4 h-auto items-center text-center justify-center gap-x-0 gap-y-0 px-4 sm:px-6 xl:px-8  text-base-content"
                >
                  <dd
                    className="  flex-none text-3xl text-center font-medium text-base-content">{metrics.enrollments[0].count}</dd>
                  <dt className="text-center ">Enrollments</dt>
                  <span className={` -mt-1`}>last month</span>
                </div>

                <div
                    className="flex flex-wrap flex-1/4 h-auto items-center text-center justify-center gap-x-0 gap-y-0 px-4 sm:px-6 xl:px-8  text-base-content invisible md:visible"
                >
                  <dd className="  flex-none text-3xl text-center font-medium">{metrics.clients}</dd>
                  <dt className=" text-center ">Total</dt>
                  <span className={` -mt-1`}>clients</span>
                </div>
            </dl>
        )
    )
}
