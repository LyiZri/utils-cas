import { animated, to, useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { FunctionComponent, HTMLAttributes, RefObject, useEffect, useRef } from "react";
import KlImage from "../kl-image";

interface HoverCardProps {

}

const HoverCard: FunctionComponent<HoverCardProps> = () => {
    const domTarget = useRef<any>(null)
    const calcX = (y: number, ly: number) => {
        const _y = ((y - domTarget.current?.offsetTop) - domTarget.current?.offsetHeight / 2)

        return (_y / (domTarget.current.clientHeight / 2)) * -10;
    }
    const calcY = (x: number, lx: number) => {
        const _x = ((x - domTarget.current?.offsetLeft - domTarget.current.clientWidth / 2))

        return (_x / domTarget.current.clientWidth / 2) * 30;
    };


    const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(() => ({
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        zoom: 0,
        x: 0,
        y: 0,
        config: { mass: 5, tension: 350, friction: 40 }
    }))

    const [{ wheelY }, wheelApi] = useSpring(() => ({ wheelY: 0 }))
    useGesture(
        {
            // onDrag: ({ active, offset: [x, y] }) =>
            //   api({ x, y, rotateX: 0, rotateY: 0, scale: active ? 1 : 1.1 }),
            onPinch: ({ offset: [d, a] }) => api({ zoom: d / 200, rotateZ: a }),
            onMove: ({ xy: [px, py], dragging }) =>
                !dragging &&
                api({
                    rotateX: calcX(py, y.get()),
                    rotateY: calcY(px, x.get()),
                    scale: 1.1
                }),
            onHover: ({ hovering }) =>
                !hovering && api({ rotateX: 0, rotateY: 0, scale: 1 }),
            onWheel: ({ event, offset: [, y] }) => {
                event.preventDefault();
                wheelApi.set({ wheelY: y });
            }
        },
        { target: domTarget, eventOptions: { passive: false } }
    );

    return <div className="w-48 h-48">
        <animated.div
            ref={domTarget}
            style={{
                transform: "perspective(600px)",
                x,
                y,
                scale: to([scale, zoom], (s, z) => s + z),
                rotateX,
                rotateY,
                rotateZ
            }}
        >
            <animated.div>
                <KlImage className="" src={"https://test-cdn.nextme.one/user/81b1adbf-4825-454e-8b82-fee7359c3c45/1680591123497.png"} alt="" width={144} height={144} />
            </animated.div>
        </animated.div>
    </div>
}

export default HoverCard;