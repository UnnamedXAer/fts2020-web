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

export type NewFlatMember = {
	emailAddress: User['emailAddress'];
	userName: User['userName'];
};

export enum MembersStatus {
	'loading',
	'not_found',
	'accepted',
	'ok',
	'error',
	'invalid',
	'already_member',
}

interface Props {}
type RouterParams = {
	id: string;
};

interface Props extends RouteComponentProps<RouterParams> {}

const FlatInviteMembers: React.FC<Props> = ({ match, location, history }) => {
	const dispatch = useDispatch();
	const flatId = +match.params.id;
	const isNewFlat = !!new URLSearchParams(location.search).get('new');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [inputValue, setInputValue] = useState('');
	const loggedUser = useSelector((state: RootState) => state.auth.user)!;
	const flatMembers = useSelector(
		(state: RootState) =>
			state.flats.flats.find((x) => x.id === flatId)?.members
	);
	const [membersEmails, setMembersEmails] = React.useState<
		NewFlatMember['emailAddress'][]
	>([]);
	const [members, setMembers] = React.useState<Partial<User>[]>([]);
	const [membersStatus, setMembersStatus] = useState<{
		[key: string]: MembersStatus;
	}>({});
	const [inputError, setInputError] = useState(false);

	const inputRef = useRef<HTMLInputElement>();

	useEffect(() => {
		if (!flatMembers) {
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
		}
	}, [dispatch, flatId, flatMembers]);

	const submitMemberHandler = () => {
		const email = inputValue.trim().toLowerCase();
		const emailValid = emailAddressRegExp.test(email);
		if (emailValid) {
			if (!membersEmails.includes(email)) {
				submitMember(email);
			}
			setInputValue('');
			setInputError(false);
			inputRef.current!.focus();
		} else {
			setInputError(true);
		}
	};

	const submitMember = (email: NewFlatMember['emailAddress']) => {
		setMembersEmails((prevSate) => [email].concat(prevSate));

		let member: User | undefined;
		if (flatMembers) {
			member = flatMembers.find((x) => x.emailAddress === email);
			if (member instanceof User) {
				addUserToMembers(member, MembersStatus.already_member);
			}
		}
		if (!member) {
			setMembersStatus((prevState) => ({
				...prevState,
				[email]: MembersStatus.loading,
			}));
			setMembers((prevSate) =>
				prevSate.concat({ emailAddress: email } as Partial<User>)
			);
			getUserByEmail(email);
		}
	};

	const addUserToMembers = (user: User, status: MembersStatus) => {
		setMembersStatus((prevState) => ({
			...prevState,
			[user.emailAddress]: MembersStatus.accepted,
		}));
		setTimeout(() => {
			setMembersStatus((prevState) => ({
				...prevState,
				[user.emailAddress]: status,
			}));
		}, 1200);

		setMembers((prevSate) => {
			const idx = prevSate.findIndex(
				(x) => x.emailAddress === user.emailAddress
			);
			const updatedState = [...prevSate];
			const updatedUser = new User(
				user.id,
				user.emailAddress.toLowerCase(),
				user.userName,
				user.provider,
				user.joinDate,
				user.avatarUrl,
				user.active
			);
			if (idx === -1) {
				updatedState.push(updatedUser);
			} else {
				updatedState[idx] = updatedUser;
			}
			return updatedState;
		});
	};

	const getUserByEmail = useCallback(
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
					addUserToMembers(response.data, MembersStatus.ok);
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

	const submitHandler = async () => {
		const emails: User['emailAddress'][] = [];
		members.forEach(({ emailAddress }) => {
			const status = membersStatus[emailAddress!];
			if (
				status !== MembersStatus.invalid &&
				status !== MembersStatus.already_member &&
				emailAddress !== loggedUser.emailAddress
			) {
				emails.push(emailAddress!);
			}
		});

		if (emails.length === 0) {
			return setError('There is no one to invite.');
		}
		setError(null);
		setLoading(true);
		try {
			await axios.post(`/flats/${flatId}/members/invite`, {
				members: emails,
			});
			history.replace(`/flats/${flatId}`);
		} catch (err) {
			const error = new HttpErrorParser(err);
			const msg = error.getMessage();
			setError(msg);
			setLoading(false);
		}
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
					</Typography>
					<Typography variant="caption" color="textSecondary">
						New members can be invited later.
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
							error={inputError}
							fullWidth
							name="addEmail"
							helperText={
								inputError
									? 'Enter valid email address.'
									: 'Type email address of person that you want to add as flat member.'
							}
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
									onClick={() =>
										isNewFlat
											? history.replace(
													`/flats/${flatId}`
											  )
											: history.goBack()
									}
									variant="text"
									color="primary"
									type="button"
								>
									{isNewFlat ? 'Later' : 'Back'}
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
									Send
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
