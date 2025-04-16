import Welcome from "./Welcome";

type IHistoryItemInput = null | string;
type IHistoryItemType = "commandOutput" | "commandError" | "welcomeMessage";

export interface IHistoryItem {
    type: IHistoryItemType;
    input: IHistoryItemInput;
    output: string;
}

function HistoryItem({ prompt, item }: { prompt: string, item: IHistoryItem }) {

    if (item.type === "welcomeMessage") {
        return <Welcome />
    }

    return <div>
        {item.input !== null && <div>{prompt} {item.input}</div>}
        <div className={item.type}>{item.output}</div>
    </div>;
}

export default function History({ prompt, history }: { prompt: string, history: IHistoryItem[] }) {
    return <>
        {history.map((item, index) => <HistoryItem key={index} prompt={prompt} item={item} />)}
    </>;
}