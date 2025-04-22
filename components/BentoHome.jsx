import HoverGif from '@/components/HoverGif';

export default function BentoHome() {
    return (
        <div className="bg-white py-8 sm:py-2">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                {/*<h2 className="text-base/7 font-semibold text-indigo-600">Deploy faster</h2>*/}
                {/*<p className="mt-2 max-w-lg text-pretty text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">*/}
                {/*    Everything you need to deploy your app*/}
                {/*</p>*/}
                <div className="mt-0 grid grid-cols-1 gap-4 sm:mt-6 lg:grid-cols-6 lg:grid-rows-2">
                    <div className="relative lg:col-span-3">
                        <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
                            <HoverGif staticSrc="/search.png" hoverSrc="/search.gif" alt={`search`} width={`530`} height={`300`} className={`h-80 object-cover object-left`}/>
                            <div className="p-10 pt-4">
                              <h3 className="/4 font-semibold text-indigo-600">Convenience</h3>
                              <p className="mt-2  font-medium tracking-tight text-gray-950">Client name search</p>
                              <p className="mt-2 max-w-lg /6 text-gray-600">
                                    Use the text field to search for a client by first name, or last name.
                                </p>
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
                    </div>
                    <div className="relative lg:col-span-3">
                        <div className="absolute inset-px rounded-lg bg-white lg:rounded-tr-[2rem]" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
                            <HoverGif staticSrc="/filter.png" hoverSrc="/filter.gif" alt={`search`} width={`620`} height={`330`} className={`h-80 object-cover object-left`}/>

                            <div className="p-10 pt-4">
                              <h3 className="/4 font-semibold text-indigo-600">Organization</h3>
                              <p className="mt-2  font-medium tracking-tight text-gray-950">Filtering options</p>
                              <p className="mt-2 max-w-lg /6 text-gray-600">
                                    Filter clients by their status, age group, or both.
                                </p>
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-tr-[2rem]" />
                    </div>
                    <div className="relative lg:col-span-2">
                        <div className="absolute inset-px rounded-lg bg-white lg:rounded-bl-[2rem]" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
                            <HoverGif staticSrc="/grouping.png" hoverSrc="/grouping.gif" alt={`search`} width={`620`} height={`330`} className={`h-80 object-cover object-left`}/>

                            <div className="p-10 pt-4">
                              <h3 className="/4 font-semibold text-indigo-600">Logical</h3>
                              <p className="mt-2  font-medium tracking-tight text-gray-950">Grouping</p>
                              <p className="mt-2 max-w-lg /6 text-gray-600">
                                    Choose to group clients by their status.
                                </p>
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-bl-[2rem]" />
                    </div>
                    <div className="relative lg:col-span-2">
                        <div className="absolute inset-px rounded-lg bg-white" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                            <HoverGif staticSrc="/activity.png" hoverSrc="/activity.gif" alt={`search`} width={`620`} height={`330`} className={`h-80 object-cover object-left`}/>

                            <div className="p-10 pt-4">
                              <h3 className="/4 font-semibold text-indigo-600">Tracking</h3>
                              <p className="mt-2  font-medium tracking-tight text-gray-950">Catalog all of your client
                                interactions.</p>
                              <p className="mt-2 max-w-lg /6 text-gray-600">
                                    Maecenas at augue sed elit dictum vulputate, in nisi aliquam maximus arcu.
                                </p>
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5" />
                    </div>
                    <div className="relative lg:col-span-2">
                        <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
                        <div className=" relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
                            <HoverGif staticSrc="/notes.png" hoverSrc="/notes.gif" alt={`search`} width={`620`} height={`330`} className={`h-80 object-cover object-left`}/>

                            <div className="p-10 pt-4">
                              <h3 className="/4 font-semibold text-indigo-600">Clarity</h3>
                              <p className="mt-2  font-medium tracking-tight text-gray-950">Activity notes</p>
                              <p className="mt-2 max-w-lg /6 text-gray-600">
                                    Add detailed notes to clients to help you keep track of their progress.
                                </p>
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
