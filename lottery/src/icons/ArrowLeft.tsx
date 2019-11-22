import { FunctionComponent, h } from 'preact';

interface IProps {
    className?: string
    onClick?: () => void
}

const ArrowLeft = ({className, onClick}: IProps) => <div style={{cursor: onClick ? 'pointer' : 'inherit'}}
    onClick={onClick} className={className}>
    <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.78566 0.771305C10.2086 0.348367 10.8744 0.348367 11.2974 0.771305C11.706 1.17995 11.706 1.86008 11.2974 2.26778L3.6321 9.93305H19.4008C19.9905 9.93305 20.4744 10.4017 20.4744 10.9913C20.4744 11.581 19.9905 12.0649 19.4008 12.0649H3.6321L11.2974 19.7159C11.706 20.1388 11.706 20.8199 11.2974 21.2276C10.8744 21.6505 10.2086 21.6505 9.78566 21.2276L0.305755 11.7477C-0.102895 11.339 -0.102895 10.6589 0.305755 10.2512L9.78566 0.771305Z"
            fill="white"/>
    </svg>
</div>;

export default ArrowLeft;
