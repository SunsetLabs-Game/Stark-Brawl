import { useState } from "react";
import ClanCard from "@/components/SocialHub/sections/utils//ClanCard";
import ClanDetailsModal from "@/components/SocialHub/sections/utils/ClanDetailsModal";
import { clansData } from "@/components/SocialHub/sections/utils/mockData";
import { Clan } from "@/components/SocialHub/sections/utils/mockData";

const Clans = ({ searchQuery }: { searchQuery: string }) => {
	const [selectedClan, setSelectedClan] = useState<Clan | null>(null);

	const handleViewClick = (clan: Clan) => {
		setSelectedClan(clan);
	};

	const handleRequestJoin = () => {
		setSelectedClan(null);
	};

	const filteredClans = clansData.filter(
		(clan) =>
			clan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			clan.tag.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
				{filteredClans.map((clan) => (
					<ClanCard key={clan.id} clan={clan} onViewClick={handleViewClick} />
				))}
			</div>
			{selectedClan && (
				<ClanDetailsModal
					clan={selectedClan}
					onClose={() => setSelectedClan(null)}
					onRequestJoin={handleRequestJoin}
				/>
			)}
		</div>
	);
};

export default Clans;
