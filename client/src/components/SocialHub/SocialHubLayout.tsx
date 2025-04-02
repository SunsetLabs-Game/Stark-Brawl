import React from "react";
import SocialNavigationTabs from "./SocialNavigationTabs";
import { Friends, Requests, Messages, Clans } from "./sections";
import Sidebar from "./Sidebar";
import { mockFriendRequests } from "./sections/Requests/friendRequests";
import { useState } from "react";
const SocialHubLayout = () => {
	const [activeTab, setActiveTab] = React.useState("friends");
	const [requests, setRequests] = React.useState(mockFriendRequests);
	const [searchQuery, setSearchQuery] = useState("");

	const renderContent = () => {
		switch (activeTab) {
			case "friends":
				return <Friends search={searchQuery} />;
			case "requests":
				return <Requests requests={requests} setRequests={setRequests} />;
			case "messages":
				return <Messages />;
			case "clans":
				return <Clans searchQuery={searchQuery} />;
			default:
				return <Friends search={searchQuery} />;
		}
	};

	return (
		<div className="min-h-screen bg-customPurple flex">
			<div className="flex-1 flex flex-col">
				<header className="flex flex-col md:flex-row justify-between items-center h-10">
					<div className="flex items-center gap-2 ml-2">
						<button className="text-white/80 hover:text-white">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 12h14M12 5l7 7-7 7"
								/>
							</svg>
						</button>
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1">
								<img
									src="/nft4.png"
									alt=""
									className="w-6 h-6 rounded-full border-2 border-orange-500"
								/>
								<span className="text-white text-xs">u/Warmix7</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="flex items-center px-1.5 py-0.5 bg-[#4e1780] rounded-xl">
									<span className="flex items-center gap-1">
										<svg
											className="w-2 h-2"
											fill="none"
											stroke="orange"
											strokeWidth={2}
											viewBox="0 0 20 20"
										>
											<path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
										</svg>
										<span className="text-[7px] text-white/90">LEVEL 42</span>
									</span>
								</span>
								<div className="flex items-center gap-2">
									<button className="flex items-center px-2 py-1 bg-[#5a0573c2] rounded-[6px] border border-[#a76dca80] border-[0.5px]">
										<img
											src="/trophy.png"
											alt="Trophy"
											className="w-3 h-3 mr-1 filter brightness-0 invert"
										/>
										<span className="text-white text-xs">15644</span>
									</button>
									<button className="flex items-center px-2 py-1 bg-[#5a0573c2] rounded-[6px] border border-[#a76dca80] border-[0.5px]">
										<img
											src="/wallet.png"
											alt="Wallet"
											className="w-3 h-3 mr-1 filter brightness-0 invert"
										/>
										<span className="text-white/70 text-[10px]">
											0x1234...5678
										</span>
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2 mt-2 md:mt-0">
						<button className="flex items-center px-2 py-1 bg-[#5a0573c2] rounded-[6px] border border-[#a76dca80] border-[0.5px]">
							<svg
								className="w-2 h-2 mr-1"
								fill="none"
								stroke="pink"
								strokeWidth={2}
								viewBox="0 0 20 20"
							>
								<path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
							</svg>
							<span className="text-white text-xs">5546</span>
						</button>
						<button className="flex items-center px-2 py-1 bg-[#5a0573c2] rounded-[6px] border border-[#a76dca80] border-[0.5px]">
							<img
								src="/crown.png"
								alt="crown"
								className="w-3 h-3 filter brightness-0 invert mr-1"
							/>
							<span className="text-white text-xs">489</span>
						</button>
						<button className="flex items-center px-2 py-2.5 bg-[#5a0573c2] rounded-[6px] border border-[#a76dca80] border-[0.5px] mr-2">
							<img
								src="/volume-up.png"
								alt="volume"
								className="w-3 h-3 filter brightness-0 invert"
							/>
						</button>
					</div>
				</header>

				<div className="border-t border-[#a76dca80] my-2" />

				<div className="flex flex-col md:flex-row mt-4">
					<Sidebar className="mt-4 md:w-1/4" />
					<div className="flex-1 flex flex-col">
						<main className="p-4">
							<div className="flex items-center justify-center mb-4">
								<img
									src="/user.png"
									alt="Icon"
									className="w-6 h-6 mr-2 filter brightness-0 invert"
								/>
								<h1 className="text-xl text-white">SOCIAL</h1>
							</div>
							<div className="flex items-center border border-[#a76dca80] rounded mb-4 bg-[#5a0573c2] w-1/6">
								<img
									src="/search.png"
									alt="Search"
									className="w-4 h-4 ml-2 filter brightness-0 invert"
								/>
								<input
									type="text"
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search friends or clans..."
									className="w-full p-2 bg-transparent border-0 focus:outline-none text-white"
								/>
							</div>
							<SocialNavigationTabs
								activeTab={activeTab}
								onTabChange={setActiveTab}
								requestCount={requests.length}
							/>
							<div className="mt-6">{renderContent()}</div>
						</main>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SocialHubLayout;
