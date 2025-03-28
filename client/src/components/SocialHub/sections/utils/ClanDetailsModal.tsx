"use client";

import React from "react";
import { Trophy, Users, Info, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Clan } from "@/components/SocialHub/sections/utils/mockData";
import RequestToJoin from "@/components/SocialHub/sections/utils/RequestToJoin";

interface ClanDetailsModalProps {
	clan: Clan | null;
	onClose: () => void;
	onRequestJoin: (clan: Clan) => void;
}

const ClanDetailsModal: React.FC<ClanDetailsModalProps> = ({ clan, onClose }) => {
	if (!clan) return null;

	const getStatusStyle = (status: Clan["status"]): string => {
		switch (status) {
			case "Open":
				return "bg-green-500/60 text-white";
			case "Invite Only":
				return "bg-yellow-600/80 text-white";
			case "Closed":
				return "bg-red-500 text-white";
			default:
				return "bg-gray-500 text-white";
		}
	};

	return (
		<AnimatePresence>
			{clan && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="fixed inset-0 bg-black bg-opacity-65 flex justify-center items-center z-50 p-4"
					onClick={onClose}
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="bg-gradient-to-br from-[#553376] to-[#6d0664f2] rounded-xl"
					>
						<motion.div
							className="bg-gradient-to-br from-purple-800/50 to-pink-100/5 rounded-xl p-6 w-full xl:w-[620px]  border-2 border-[#7530ba]"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-start mb-4">
								<div className="flex gap-4">
									<img src={clan.image} alt="img" className="w-[60px] h-[60px]" />
									<div>
										<div className="flex flex-col font-bold text-white">
											<p className=" text-xl font-bold"> {clan.name} </p>
											<p className="text-gray-300/80 text-sm">{clan.tag}</p>
										</div>
									</div>
								</div>
								<button
									onClick={onClose}
									className="text-gray-100 hover:text-white transition-colors text-sm"
								>
									✕
								</button>
							</div>

							<div className="flex flex-wrap items-center justify-between mb-4 gap-3">
								<div
									className="flex-1 bg-purple-500/20  p-3 rounded-md border-2 border-[#7530ba]"
									style={{ borderRadius: "8px" }}
								>
									<div className="flex items-center gap-2">
										<Trophy size={15} className=" text-yellow-400" />
										<p className="text-gray-100 text-[15px] font-black">
											Total Trophies
										</p>
									</div>
									<p className="text-gray-200 text-base font-medium">
										{clan.trophies.toLocaleString()}
									</p>
								</div>
								<div
									className="flex-1 bg-purple-500/20  p-3 border-2 border-[#7530ba]"
									style={{ borderRadius: "8px" }}
								>
									<div className="flex items-center gap-2">
										<Users size={15} className=" text-blue-400 font-bold" />{" "}
										<p className="text-gray-100 text-[15px]  font-black">
											Members
										</p>
									</div>
									<p className="text-gray-200 text-base font-medium">
										{clan.members}/{clan.maxMembers}
									</p>
								</div>
							</div>

							<div
								className="bg-[#4a2a6b] p-3 rounded-lg mb-4 bg-purple-500/20 border-2 border-[#7530ba]"
								style={{ borderRadius: "8px" }}
							>
								<div className="flex items-center gap-[6px] mb-2">
									<Info size={15} className=" text-blue-400 font-bold" />
									<p className="text-gray-100 text-[15px]  font-black">
										Description
									</p>
								</div>
								<p className="text-gray-300 font-semibold text-[15px]">
									{clan.description}
								</p>
							</div>

							<div className="flex justify-between items-center mb-4">
								<div className="flex items-center gap-2">
									<Globe size={16} className="text-green-400 mt-[1.5px]" />

									<p className="text-gray-300 font-semibold text-[15px]">
										Region: <span>{clan.region}</span>
									</p>
								</div>
								<span
									className={`px-3 py-1 text-sm rounded ${getStatusStyle(
										clan.status
									)}`}
								>
									{clan.status}
								</span>
							</div>

							<div
								className="bg-[#4a2a6b] p-3 rounded-lg mb-4 bg-purple-500/20 border-2 border-[#7530ba]"
								style={{ borderRadius: "8px" }}
							>
								<div className="flex items-center space-x-2">
									<Trophy size={15} className=" text-yellow-400" />
									<p className="text-gray-100 text-[15px]  font-black">
										Required Trophies
									</p>
								</div>
								<p className="text-gray-300 font-semibold text-[15px] mt-[6px]">
									{clan.requiredTrophies.toLocaleString()} trophies needed to join
								</p>
							</div>

							<div className=" flex justify-end">
								<RequestToJoin status={clan.status} />
							</div>
						</motion.div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ClanDetailsModal;
