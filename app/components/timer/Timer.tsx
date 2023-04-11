import { useStopwatch } from "react-timer-hook";
import './Timer.scss'

export default function timer() {
    const {
        seconds,
        minutes,
        hours,
    } = useStopwatch({ autoStart: true });

    return (
        <div className='timer'>
            <span>
                {hours.toString().length === 1 ? '0' + hours : hours}
            </span>:
            <span>
                {minutes.toString().length === 1 ? '0' + minutes : minutes}
            </span>:
            <span>
               {seconds.toString().length === 1 ? '0' + seconds : seconds}
            </span>
        </div>
    );
}