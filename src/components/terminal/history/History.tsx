interface IHistoryItem {
    className: string;
    input?: string;
    output: string;
}

export default function history({prompt, history}: {prompt: string, history: IHistoryItem[]}) {
    return <>
        <div>
            {history.map((item, index) => (
                <div key={index}>
                    {item.input !== null && <div>{prompt} {item.input}</div>}
                    <div className={item.className}>{item.output}</div>
                </div>
            ))}
        </div>
    </>;
}