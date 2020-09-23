import React from 'react';
import './ExternalProviders.css';
import { Button } from '@material-ui/core';
import { GTranslate, GitHub } from '@material-ui/icons';

interface Props {
	clickHandler: (provider: 'google' | 'github') => void;
}

export const ExternalProviders: React.FC<Props> = ({ clickHandler }) => {
	return (
		<>
			<Button
				className="external-providers-button google"
				size="large"
				title="Google Authentication"
				color="primary"
				onClick={() => clickHandler('google')}
				startIcon={<GTranslate />}
			>
				Google
			</Button>
			<Button
				className="external-providers-button github"
				title="Github Authentication"
				onClick={() => clickHandler('github')}
				startIcon={<GitHub />}
			>
				Github
			</Button>
		</>
	);
};
