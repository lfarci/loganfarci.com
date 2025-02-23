import { Key } from "react";
import Welcome from "./Welcome";

type IHistoryItemInput = null | string;
type IHistoryItemType = "commandOutput" | "commandError" | "welcomeMessage";

export interface IHistoryItem {
    type: IHistoryItemType;
    input: IHistoryItemInput;
    output: string;
}

function HistoryItem({ item }: { item: IHistoryItem }) {

    if (item.type === "welcomeMessage") {
        return <Welcome />
    }

    return <div>
        {item.input !== null && <div>{item.input}</div>}
        <div className={item.type}>{item.output}</div>
    </div>;
}

export default function History({ prompt, history }: { prompt: string, history: IHistoryItem[] }) {
    return <>
        {history.map((item, index) => <HistoryItem key={index} item={item} />)}
    </>;
}