import styles from './Button.module.scss'

function Button({ content, backgroundColor, color }) {
	return (
		<button className={styles.button}
			style={{ backgroundColor, color }}
		>{content}</button>
	);
}

export default Button;