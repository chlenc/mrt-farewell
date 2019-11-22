import { FunctionComponent, h } from 'preact';
import styles from '@src/icons/styles.less';
import cn from 'classnames';

interface IProps {
    className?: string
    onClick?: () => void
    name?: string
}

const Ticket = ({className, onClick, name}: IProps) => <div style={{cursor: onClick ? 'pointer' : 'inherit'}}
                                                      onClick={onClick} className={cn(styles.ticket, className)}>
    {name && <div class={styles.text}>{name}</div>}
    <svg width="156" height="81" viewBox="0 0 156 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d)">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M11 -0.000732422C5.47715 -0.000732422 1 4.47642 1 9.99927V23.4368C8.7665 23.4368 15.0625 29.7328 15.0625 37.4993C15.0625 45.2658 8.7665 51.5618 1 51.5618V64.9993C1 70.5221 5.47715 74.9993 11 74.9993H141C146.523 74.9993 151 70.5221 151 64.9993V51.5618C143.233 51.5618 136.938 45.2658 136.938 37.4993C136.938 29.7328 143.233 23.4368 151 23.4368V9.99927C151 4.47642 146.523 -0.000732422 141 -0.000732422H11Z"
                  fill="url(#paint0_linear)"/>
        </g>
        <line x1="14.8457" y1="0.653076" x2="137.153" y2="0.653076" stroke="url(#paint1_linear)"/>
        <line opacity="0.7" x1="14.8457" y1="74.4993" x2="137.153" y2="74.4993" stroke="url(#paint2_linear)"/>
        <defs>
            <filter id="filter0_d" x="0" y="-0.000732422" width="156" height="81" filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                <feOffset dx="2" dy="3"/>
                <feGaussianBlur stdDeviation="1.5"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
            </filter>
            <linearGradient id="paint0_linear" x1="151" y1="-0.000736892" x2="151" y2="74.9993"
                            gradientUnits="userSpaceOnUse">
                <stop stop-color="#FDED8D"/>
                <stop offset="1" stop-color="#FFD046"/>
            </linearGradient>
            <linearGradient id="paint1_linear" x1="137.153" y1="0.152914" x2="14.8441" y2="0.894919"
                            gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0"/>
                <stop offset="0.276042" stop-color="white"/>
                <stop offset="0.708333" stop-color="white"/>
                <stop offset="1" stop-color="white" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="paint2_linear" x1="137.153" y1="73.9991" x2="14.8441" y2="74.7411"
                            gradientUnits="userSpaceOnUse">
                <stop stop-color="white" stop-opacity="0"/>
                <stop offset="0.276042" stop-color="white"/>
                <stop offset="0.708333" stop-color="white"/>
                <stop offset="1" stop-color="white" stop-opacity="0"/>
            </linearGradient>
        </defs>
    </svg>

</div>;

export default Ticket;
