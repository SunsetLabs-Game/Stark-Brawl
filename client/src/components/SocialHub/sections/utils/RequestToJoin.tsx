import { Send, UserPlus, X } from "lucide-react";

interface Props {
	status: string;
}
const RequestToJoin = ({ status }: Props) => {
	const getIcon = () => {
		switch (status) {
			case "Open":
				return <UserPlus size={15} />;
			case "Invite Only":
				return <Send size={15} />;
			case "Closed":
				return <X size={13} />;
			default:
				return <UserPlus size={13} />;
		}
	};

	const handleClick = (status: string) => {
		if (status === "Open") {
			alert("You have joined the clan");
		} else if (status === "Invite Only") {
			alert("You have requested to join the clan");
		}
	};
	return (
		<button
			onClick={() => handleClick(status)}
			disabled={status === "Closed"}
			className={`w-max bg-blue-600 ${
				status === "Open" && "bg-green-600 hover:bg-green-500"
			} ${
				status === "Closed" && "bg-green-600 hover:bg-green-500"
			} text-white px-4 py-2 hover:bg-blue-500 transition-colors flex items-center justify-center gap-3`}
			style={{ borderRadius: "8px", opacity: status === "Closed" ? 0.3 : 1 }}
		>
			{getIcon()}
			<span className=" text-sm">
				{status === "Closed"
					? "Clan Closed"
					: status === "Open"
					? "Join Clan"
					: "Request to join"}
			</span>
		</button>
	);
};

export default RequestToJoin;
