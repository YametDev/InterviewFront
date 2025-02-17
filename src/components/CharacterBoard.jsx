export const CharacterBoard = (props) => {
  const { text, onClick, space, ...others } = props;

  return (
    <>
      {text.split("\\n").map((line, iLine) => (
        <span key={iLine} style={{cursor: "pointer"}}>
          {[...line].map((character, index) => (
            <span key={index} {...others} onClick={() => onClick(character)}>
              {character}{space}
            </span>
          ))}
          <br/>
        </span>
      ))}
    </>
  );
};
