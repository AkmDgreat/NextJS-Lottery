//yarn add web3uikit

import { ConnectButton } from "web3uikit"

export default function Header() {
    return(
        <div className="border-b-2 p-5 flex flex-row">
            <h1 className="py-4 px-4 font-bold text-3xl">Decentralised Lottery</h1>
            <div className="ml-auto py-2 px-4">
            <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}

