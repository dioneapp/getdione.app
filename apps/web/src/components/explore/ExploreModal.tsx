import { motion } from "framer-motion";
import { Calendar, CalendarSync, Download, Heart, Library, Tag } from "lucide-react";

interface ScriptData {
	id: number;
	name: string;
	description: string;
	author: string;
	author_url: string;
	logo_url: string;
	banner_url: string;
	script_url: string;
	version: string;
	tags: string[];
	likes: number;
	downloads: number;
	created_at: string;
	updated_at: string;
    og_author?: string;
}


export default function ExploreModal({ script, setSelectedScript }: { script: ScriptData, setSelectedScript: (script: ScriptData | null) => void }) {
	return (
		<motion.article 
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0,  filter: "blur(10px)" }}
        transition={{ duration: 0.15 }}
        className="fixed max-md:p-4 inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center z-50 overflow-hidden">
			<div className="bg-white/5 border border-white/5 rounded-xl p-6 md:max-w-2xl min-h-[50dvh] w-full mx-auto shadow-2xl flex flex-col h-full md:max-h-[50vh]">
                <div className="flex flex-col flex-1 h-full items-center mx-4 gap-4">
                    <div className="flex flex-1 h-full max-h-full max-md:flex-col items-start justify-start gap-6 w-full">
                        <div className="w-fit md:h-full flex md:flex-col items-start justify-start gap-2 max-md:border-0 md:border-r md:pr-6 md:border-white/10">
                            <div>
                                {script.logo_url ? (
                                    <img
                                        src={script.logo_url || "/favicon.ico"}
                                        alt={`${script.name} logo`}
                                        className="bg-white/10 w-24 h-24 max-md:w-44 max-md:h-44 object-center mx-auto flex justify-center items-center rounded-md object-cover"
                                    />
                                ): (
                                    <div>
                                        <span className="bg-white/10 w-24 h-24 max-md:w-44 max-md:h-44 object-center mx-auto flex justify-center items-center rounded-md object-cover max-md:text-xl">
                                            {script.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="bg-neutral-700/80 px-6 rounded-md border border-white/10 flex gap-2 items-center justify-center mx-auto mt-2">
                                    <span className="text-neutral-300 text-sm font-medium font-mono">
                                        v{script.version || "1.0.0"}
                                    </span>
                                </div>
                            </div>
                            <div className="pr-0.5 flex flex-col gap-1 md:mt-4 max-md:mt-2 max-md:ml-4">
                                <span className="text-[10px] text-neutral-300 flex justify-left items-center text-balance">
                                    <Download className="w-3 h-3 mr-2" /><span className="text-neutral-200 mr-1">{script.downloads}</span> downloads
                                </span>
                                <span className="text-[10px] text-neutral-300 flex justify-left items-center text-balance">
                                    <Calendar className="w-3 h-3 mr-2" /><span className="text-neutral-200 mr-1">{new Date(script.created_at).toLocaleDateString()}</span>
                                </span>
                                <span className="text-[10px] text-neutral-300 flex justify-left items-center text-balance">
                                    <CalendarSync className="w-3 h-3 mr-2" />
                                    <span className="text-neutral-200 mr-1">
                                        {script.updated_at
                                            ? new Date(script.updated_at).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
                                            : ""}
                                    </span>
                                </span>
                                <span className="text-[10px] text-neutral-300 flex justify-left items-center text-balance">
                                    <Heart className="w-3 h-3 mr-2" /><span className="text-neutral-200 mr-1">{script.likes}</span> likes
                                </span>
                                <span className="text-[10px] text-neutral-300 flex justify-left items-center text-balance">
                                    <Tag className="w-3 h-3 mr-2" /><span className="text-neutral-200 mr-1 capitalize">{script.tags}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 max-md:mt-4">
                            <span className="w-full flex items-end justify-between">
                                <h1 className="text-white text-3xl font-medium">{script.name}</h1>
                            </span>
                            <p className="text-neutral-300 text-sm text-balance">{script.description}</p>
                            <div>
                            <a href={script.author_url} target="_blank" rel="noopener noreferrer" className="text-neutral-300 text-xs">
                                Uploaded by <span className="text-[#BCB1E7] hover:underline underline-offset-2 cursor-pointer">{script.author}</span>
                                {script.og_author && (
                                    <>
                                        {" "} & created by <span className="text-[#BCB1E7] hover:underline underline-offset-2">{script.og_author}</span>.
                                    </>
                                )}
                            </a>
                        </div>
                        </div>
                    </div>
                    <div className="mt-auto h-fit w-fit flex justify-end items-end ml-auto">
                        <div className="mt-auto gap-4 flex">
                            <button onClick={() => setSelectedScript(null)} className="bg-white/10 hover:bg-white/20 text-neutral-300 border border-white/10 rounded-lg px-4 p-1 text-sm max-md:text-lg cursor-pointer duration-300 transition-colors">
                                Close
                            </button>
                            <button onClick={() => (window.location.href = `dione://download=${script.id}`)} className="bg-white hover:bg-white/80 text-black font-semibold border border-white/10 rounded-lg px-4 p-1 text-sm max-md:text-lg cursor-pointer duration-300 transition-colors">
                                Install
                            </button>
                        </div>
                    </div>
                </div>
            </div>
		</motion.article>
	)
}