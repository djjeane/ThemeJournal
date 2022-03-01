import React, { useState, useEffect } from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logout } from "../../firebase";
import axios from "../../axios";
import moment from "moment";
import { BsCircleHalf, BsCircleFill, BsCircle } from 'react-icons/bs';


export default function Summary()
{
	const [user, loading, error] = useAuthState(auth);
	const [theme, setTheme] = useState({
		title: "",
		description: "",
		outcomes: [],
		goals_descriptions: [],
	});
	const [journals, setJournals] = useState([]);

	function getDates()
	{
		var dates = [];
		var startDate = new Date() - 1000 * 60 * 60 * 24 * 7;
		while (startDate <= new Date()) {
			dates.push(new Date(startDate));
			startDate += 86400000;
		}
		return dates;
	}

	useEffect(() =>
	{
		async function fetchTheme()
		{
			let url = "v2/themes/" + user.uid;

			const response = await axios.get(url);
			setTheme(response.data[0]);
		}

		async function FetchJournals()
		{
			var result = await axios.get("v2/journals/" + user.uid);

			if (result.data.length > 0) {
				console.log(result.data);
				setJournals(result.data);
			}
		}

		if (theme.title === "") {
			fetchTheme();
			FetchJournals();
		}
	}, []);

	return (
		<Container>
			<Row>
				<h1>{theme.title}</h1>
			</Row>

			{/* For the last month, check each journal for the goals */}
			<Row>
				<Col></Col>
				{getDates().map((date, index) =>
				{
					return (
						<Col>
							<h5>{moment(date).format("MM-DD")}</h5>{" "}
						</Col>
					);
				})}
			</Row>
			<Col>
				{/* Goal descriptions from theme */}
				{theme.goals_descriptions.map((goal, index) =>
				{
					return (
						<Row>
							<Col>
								<h4 key={index}>{goal}</h4>
							</Col>

							{/* For each goal, check each journal for the goal */}
							{getDates().map((date, dateIndex) =>
							{
								var found = false;
								let completionNum = 0;
								for (var i = 0; i < journals.length; i++) {
									if (moment(journals[i].date).format("MM-DD-YYYY") === moment(date - (1000 * 60 * 60 * 24)).format("MM-DD-YYYY")) {

										if (!journals[i].goals[index]) {
											found = false;
											break;
										}

										found = true;
										completionNum = parseInt(journals[i].goals[index]);


									}

								}
								if (found) {
									if (completionNum === 0) {
										return (
											<Col>
												<BsCircle />
											</Col>
										);
									}
									else if (completionNum < 6) {
										return (
											<Col>
												<BsCircleHalf />
											</Col>
										);
									}
									else {
										return (
											<Col>
												<BsCircleFill />
											</Col>
										);
									}

								}
								else {
									return (
										<Col>
											<BsCircle />
										</Col>
									);
								}
							})}
						</Row>
					);
				})}
			</Col>
		</Container>
	);
}
