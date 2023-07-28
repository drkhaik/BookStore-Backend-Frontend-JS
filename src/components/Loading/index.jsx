import PacmanLoader from "react-spinners/PacmanLoader"

const Loading = () => {
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    return (
        <>
            <PacmanLoader style={style} color="#e1681c" />
        </>
    )
}

export default Loading;