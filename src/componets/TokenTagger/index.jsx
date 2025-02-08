import './styles.scss'





const TokenTagger = ({label = "dog breed"}) => {



    return (
        <div className="tagger">
            <p>X</p>
            <p>{label}</p>
        </div>
    )

}


export default TokenTagger