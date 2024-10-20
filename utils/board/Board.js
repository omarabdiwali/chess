import { useEffect, useState, useCallback } from 'react';
import { getValidMoves, colorValid, clearColors, updateCurPositions, startGame, colorSquare, nextPositions, checkMate, otherPlayerMoves, checkCastle, castling, checked } from '../../moves/helperFunctions.js';
import { useSnackbar } from 'notistack';
import styles from "./Board.module.css";
import Button from "@mui/material/Button";
import { Typography } from '@mui/material';
import useSound from 'use-sound';

export default function Board({ room, socket, color, start, position, beginning, info }) {
  const BOARD_SIZE = 8;
  const square = [];
  
  const [curPos, setCurPos] = useState(position);
  const [valid, setValid] = useState([]);
  
  const [type, setType] = useState();
  const [prevPos, setPrevPos] = useState();
  const [game, setGame] = useState(start);
  
  const [turn, setTurn] = useState(color === beginning);
  const [prevOtherPos, setPrevOther] = useState();
  const [curOtherPos, setCurOther] = useState();
  
  const [castle, setCastle] = useState(true);
  const [lCastle, setLCastle] = useState(true);
  const [rCastle, setRCastle] = useState(true);
  const [cellSize, setCellSize] = useState(1);
  
  const soundsPath = `${window.location.origin}/sounds`;

  const [playCheck] = useSound(`${soundsPath}/check.mp3`);
  const [playMove] = useSound(`${soundsPath}/move-self.mp3`);
  const [playOtherMove] = useSound(`${soundsPath}/move-opponent.mp3`);
  const [playPromotion] = useSound(`${soundsPath}/promote.mp3`);
  const [playCastle] = useSound(`${soundsPath}/castle.mp3`);
  const [playCapture] = useSound(`${soundsPath}/capture.mp3`);
  const [playEnd] = useSound(`${soundsPath}/game-end.mp3`);

  const { enqueueSnackbar } = useSnackbar();

  for (let index = 1; index <= BOARD_SIZE; index++) {
    square.push(index);
  }
  const board = square.map(_ => square);

  const changeLayout = useCallback(e => {
    setCellSize(window.innerWidth >= 560 ? 1 : window.innerWidth >= 400 ? 2 : 3);
  })

  useEffect(() => {
    startGame(position);
    setCellSize(window.innerWidth >= 560 ? 1 : window.innerWidth >= 400 ? 2 : 3);
  }, [position])

  useEffect(() => {
    window.addEventListener("resize", changeLayout);
    return () => {
      window.removeEventListener("resize", changeLayout);
    }
  }, [changeLayout])

  useEffect(() => {    
    socket.on('pieces', (pieces) => {
      pieces = JSON.parse(pieces);
      
      let fromPos = parseInt(pieces.prev);
      let toPos = parseInt(pieces.current);
      let newPiece = pieces.pieces[toPos];

      if (pieces.isChecked) {
        playCheck();
      } else if (pieces.fromPiece.includes("King") && Math.abs(fromPos - toPos) == 2) {
        playCastle();
      } else if (pieces.fromPiece != newPiece) {
        playPromotion();
      } else if (pieces.toPiece) {
        playCapture();
      } else {
        playOtherMove();
      }

      let newPos = otherPlayerMoves(pieces.pieces, fromPos, toPos);
      setCurPos(newPos);
      setPrevOther(fromPos);
      setCurOther(toPos);
      setTurn(true);
    })
    socket.on('delete', () => {
      setGame("end");
      document.getElementById("active").innerHTML = "Status: Player disconnected.";
    })
    socket.on('start', () => {
      setGame("play");
      document.getElementById("active").innerHTML = "Status: Active";
    })
    socket.on('game', (winner) => {
      playEnd();
      setGame("end");
      document.getElementById("active").innerHTML = "Status: " +  winner;
    })
  }, [socket, playCapture, playCastle, playCheck, playEnd, playOtherMove, playPromotion])

  const leaveGame = () => {
    enqueueSnackbar("Goodbye!", { autoHideDuration: 3000, variant: "success" });
    setInterval(window.location.reload(), 2000);
  }

  const pieceMovement = (e) => {
    e.preventDefault();
    if (game === "play") {
      let pos = Number(e.target.id);
      let row = Math.floor(pos / 8);
      let col = (pos - (row * 8) - 1);

      if (valid.includes(pos)) {
        let positions = [prevPos, ...valid];
        let next = color === "white" ? "black" : "white";
        let fromPiece = curPos[prevPos];
        let toPiece = curPos[pos];
        let updCurPos;

        if (pos % 8 === 0) {
          col = 7;
          row -= 1;
        }
        
        if (type.includes("King") && castle) {
          updCurPos = updateCurPositions(type, row, col, pos, curPos, prevPos, true, lCastle, rCastle);
        }
        else {
          updCurPos = updateCurPositions(type, row, col, pos, curPos, prevPos);
        }
        
        if (castle) {
          let resp = checkCastle(type, lCastle, rCastle);
          setCastle(resp[0]);
          if (lCastle) {
            setLCastle(resp[1])
          }
          if (rCastle) {
            setRCastle(resp[2])
          } 
          if (!lCastle && !rCastle) {
            setCastle(false);
          }
        }

        let newPiece = updCurPos[pos];
        let isChecked = checked(next, updCurPos);
        
        if (isChecked) {
          playCheck();
        } else if (fromPiece.includes("King") && Math.abs(pos - prevPos) == 2) {
          playCastle();
        } else if (fromPiece != newPiece) {
          playPromotion();
        } else if (toPiece) {
          playCapture();
        } else {
          playMove();
        }
        
        setValid([]);
        setType("");
        clearColors(positions);
        setPrevPos(pos);
        setTurn(false);
        clearColors([prevOtherPos, curOtherPos]);

        socket.emit('pieces', JSON.stringify({ pieces: updCurPos, fromPiece, toPiece, prev: prevPos, current: pos, isChecked, turn: next }));

        let finished = checkMate(next, curPos);
        let checkmate = finished[0];
        let winner = finished[1];

        if (checkmate) {
          playEnd();
          setGame("end");
          document.getElementById("active").innerHTML = "Status: " +  winner;
          socket.emit('game', (winner));
          return;
        }
      }
      else {
        let positions = [prevPos, ...valid];
        let types = curPos[pos];

        if (!turn || !types || types[0] !== color[0]) return;

        let curValid = getValidMoves(types, pos, curPos);
        curValid = nextPositions(curPos, curValid, color, pos, types);

        if (types.includes("King")) {
          let mayb = castling(castle, types, curPos, color, lCastle, rCastle);
          curValid = curValid.concat(mayb);
        }

        if (curValid.length > 0) {
          setType(types);
          setValid(curValid);
          clearColors(positions);
          colorSquare(pos, col, row);
          colorValid(curValid);
          setPrevPos(pos);
        }
      }
    }
  }

  return (
    <>
      <Typography>Code: {`${room}`}  -  Color: {`${color[0].toUpperCase() + color.substr(1)}`}  -  <span id="active">{info}</span></Typography>
      <Button size="small" color="error" onClick={leaveGame}>Leave</Button>
      <div id="board" onClick={e => pieceMovement(e)}>
        {board.map((_, idx) => {
          return (
            <div className={cellSize == 1 ? styles.row : cellSize == 2 ? styles.smRow : styles.xsRow} key={idx}>
              {square.map((cell, id) => {
                const pos = idx * BOARD_SIZE + cell;
                return (
                  <div className={`${cellSize == 1 ? styles.cell : cellSize == 2 ? styles.smCell : styles.xsCell} ${(idx + id + 2) % 2 === 0 ? styles.even : styles.odd }`} key={String(pos) + "a"} id={String(pos)}></div>
                )
              })}
            </div>
          )
        })}
      </div>
    </>
  )
}