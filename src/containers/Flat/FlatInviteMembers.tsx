import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
	TextField,
	Typography,
	IconButton,
	Box,
	Grid,
	Container,
	CircularProgress,
	Button,
} from '@material-ui/core';
import User from '../../models/user';
import axios from '../../axios/axios';
import { AddRounded } from '@material-ui/icons';
import { emailAddressRegExp } from '../../utils/authFormValidator';
import { NewFlatMember } from '../../containers/Flat/NewFlat';
import { APP_NAME } from '../../config/config';
import { APIUser } from '../../store/actions/users';
import { RouteComponentProps } from 'react-router-dom';
import RootState from '../../store/storeTypes';
import { useSelector, useDispatch } from 'react-redux';
import { StateError } from '../../ReactTypes/customReactTypes';
import { fetchFlatMembers } from '../../store/actions/flats';
import HttpErrorParser from '../../utils/parseError';
import InvitationMembersList from '../../components/Flat/InvitationMembersList';
import CustomMuiAlert from '../../components/UI/CustomMuiAlert';

export enum MembersStatus {
	'loading',
	'not_found',
	'accepted',
	'ok',
	'error',
	'invalid',
}

interface Props {}
type RouterParams = {
	id: string;
};

interface Props extends RouteComponentProps<RouterParams> {}

const FlatInviteMembers: React.FC<Props> = ({ match, location, history }) => {
	const dispatch = useDispatch();
	const flatId = +match.params.id;
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [inputValue, setInputValue] = useState('');
	const loggedUser = useSelector((state: RootState) => state.auth.user)!;
	const [membersEmails, setMembersEmails] = React.useState<
		NewFlatMember['emailAddress'][]
	>([loggedUser.emailAddress]);
	const [members, setMembers] = React.useState<Partial<User>[]>([loggedUser]);
	const [membersStatus, setMembersStatus] = useState<{
		[key: string]: MembersStatus;
	}>({ [loggedUser.emailAddress]: MembersStatus.ok });

	const inputRef = useRef<HTMLInputElement>();

	useEffect(() => {
		const loadMembers = async () => {
			setError(null);
			setLoading(true);
			try {
				await dispatch(fetchFlatMembers(flatId!));
			} catch (err) {
				const error = new HttpErrorParser(err);
				const msg = error.getMessage();
				setError(msg);
			}
			setLoading(false);
		};

		loadMembers();
	}, [dispatch, flatId]);

	const submitMemberHandler = () => {
		const email = inputValue.trim().toLowerCase();
		if (email !== '') {
			if (!membersEmails.includes(email)) {
				submitMember(email);
			}
			// highlight row
		}
		setInputValue('');
		inputRef.current!.focus();
	};

	const submitMember = (email: NewFlatMember['emailAddress']) => {
		setMembersEmails((prevSate) => [email].concat(prevSate));

		const isEmailAddress = emailAddressRegExp.test(email);
		if (isEmailAddress) {
			setMembersStatus((prevState) => ({
				...prevState,
				[email]: MembersStatus.loading,
			}));
			setMembers((prevSate) =>
				prevSate.concat({ emailAddress: email } as Partial<User>)
			);
			fetchUserByEmail(email);
		} else {
			setMembersStatus((prevState) => ({
				...prevState,
				[email]: MembersStatus.invalid,
			}));
		}
	};

	const fetchUserByEmail = useCallback(
		async (email: NewFlatMember['emailAddress']) => {
			const url = `/users?emailAddress=${email}`;
			try {
				const response = await axios.get<APIUser>(url);

				if (response.status === 204) {
					setMembersStatus((prevState) => ({
						...prevState,
						[email]: MembersStatus.not_found,
					}));
				} else {
					setMembersStatus((prevState) => ({
						...prevState,
						[email]: MembersStatus.accepted,
					}));
					setTimeout(() => {
						setMembersStatus((prevState) => ({
							...prevState,
							[email]: MembersStatus.ok,
						}));
					}, 1200);
					setMembers((prevSate) => {
						const idx = prevSate.findIndex(
							(x) => x.emailAddress === response.data.emailAddress
						);
						const updatedState = [...prevSate];
						updatedState[idx] = new User(
							response.data.id,
							response.data.emailAddress.toLowerCase(),
							response.data.userName,
							response.data.provider,
							response.data.joinDate,
							response.data.avatarUrl,
							response.data.active
						);
						return updatedState;
					});
				}
			} catch (err) {
				setMembersStatus((prevState) => ({
					...prevState,
					[email]: MembersStatus.error,
				}));
			}
		},
		[]
	);

	const removeMemberHandler = (email: NewFlatMember['emailAddress']) => {
		setMembers((prevMembers) => {
			const updatedMembers = prevMembers.filter(
				(x) => x.emailAddress !== email
			);
			return updatedMembers;
		});

		setMembersEmails((prevState) => prevState.filter((x) => x !== email));

		setMembersStatus((prevState) => {
			const updatedState = { ...prevState };
			delete updatedState[email];
			return updatedState;
		});
	};

	const submitHandler = () => {
		// post

		history.replace(`/flats/${flatId}`);
	};

	return (
		<Container maxWidth="sm">
			<Grid container spacing={2} direction="column">
				<Grid item>
					<Box width="100%">
						<Typography variant="h6">
							Members invitations
						</Typography>
					</Box>
				</Grid>
				<Grid item>
					<Typography variant="body2">
						Add users by entering their email address. These users
						will receive an email asking them to accept the
						invitation. Invitation will be sent also to people not
						registered in {APP_NAME}.
						<br />
						'New members can be invited later.'
					</Typography>
				</Grid>
				<Grid item>
					<Box
						display="flex"
						flexDirection="row"
						alignItems="flex-start"
						justifyContent="space-around"
						width="100%"
						paddingTop="10px"
					>
						<TextField
							inputRef={inputRef}
							onChange={(ev) => {
								setInputValue(ev.target.value);
							}}
							onKeyDown={(ev) => {
								if (ev.key === 'Enter') {
									submitMemberHandler();
								}
							}}
							inputMode="email"
							disabled={loading}
							value={inputValue}
							fullWidth
							name="addEmail"
							helperText="Type email address of person that you want to add as flat member."
							type="email"
							placeholder="Type email address and press enter to add."
						/>
						<IconButton
							type="submit"
							aria-label="search"
							disabled={loading}
							onClick={submitMemberHandler}
						>
							<AddRounded />
						</IconButton>
					</Box>
				</Grid>
				<Grid item xs zeroMinWidth>
					<InvitationMembersList
						emails={membersEmails}
						loggedUser={loggedUser}
						members={members}
						membersStatus={membersStatus}
						onRemove={removeMemberHandler}
						formLoading={loading}
					/>
				</Grid>
				<Grid item>
					{error && (
						<CustomMuiAlert severity="error">
							{error}
						</CustomMuiAlert>
					)}
				</Grid>
				<Grid item>
					<Box
						style={{
							justifyContent: 'space-around',
							alignItems: 'center',
							display: 'flex',
						}}
					>
						{loading ? (
							<CircularProgress size={36} />
						) : (
							<>
								<Button
									style={{
										paddingLeft: 40,
										paddingRight: 40,
									}}
									onClick={() => history.goBack()}
									variant="text"
									color="primary"
									type="button"
								>
									Back
								</Button>
								<Button
									style={{
										paddingLeft: 40,
										paddingRight: 40,
									}}
									onClick={submitHandler}
									variant="contained"
									color="primary"
									type="submit"
								>
									Save
								</Button>
							</>
						)}
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
};

export default FlatInviteMembers;
