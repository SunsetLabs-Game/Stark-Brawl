import React from "react";
import { Clan } from "@/components/SocialHub/sections/utils/mockData";
import { Trophy, Users, Globe, ChevronRight } from "lucide-react";

interface ClanCardProps {
	clan: Clan;
	onViewClick: (clan: Clan) => void;
}

const ClanCard: React.FC<ClanCardProps> = ({ clan, onViewClick }) => {
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
		<div
			onClick={() => onViewClick(clan)}
			className="bg-purple-700/50 p-4  border border-purple-600 flex justify-between items-center rounded-xl"
		>
			<div className=" flex flex-col gap-3 w-full ">
				<div className=" flex items-start justify-between">
					<div className=" flex gap-1">
						<img src={clan.image} alt="nft" className=" w-[60px] h-[60px]" />
						<div className="flex flex-col text-white text-base font-bold">
							<p>{clan.name} </p>
							<p className="text-gray-200/90 text-xs">{clan.tag}</p>
						</div>
					</div>
					<button
						className={`px-2 py-[2px] mt-2 h-max text-[13px] rounded ${getStatusStyle(
							clan.status
						)}`}
					>
						{clan.status}
					</button>
				</div>
				<div className=" flex items-center justify-between">
					<div className=" flex items-center gap-[6px]">
						<Trophy size={15} className=" text-yellow-400" />
						<p className=" text-white font-medium text-[13px]">
							{clan.trophies.toLocaleString()}
						</p>
					</div>
					<div className=" flex items-center gap-[4px]">
						<Users size={15} className=" text-blue-400 font-bold" />{" "}
						<p className=" text-gray-100 text-[12.5px] font-semibold">
							{clan.members}/{clan.maxMembers}
						</p>
					</div>
				</div>
				<p className="text-gray-300 font-medium bg-purple-900/40 p-2 text-sm rounded">
					{clan.description}
				</p>
				<div className="flex items-center  justify-between mt-2">
					<div className=" flex items-center gap-1">
						<Globe size={14} className=" text-gray-300" />{" "}
						<p className=" text-[12.5px] font-medium text-gray-200">{clan.region}</p>
					</div>
					<button
						onClick={() => onViewClick(clan)}
						className="flex items-center  bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 text-sm gap-[6.5px] font-semibold rounded "
					>
						<ChevronRight size={16} />
						View
					</button>
				</div>
			</div>
		</div>
	);
};

export default ClanCard;
