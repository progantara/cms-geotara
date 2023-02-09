import React from 'react';
import { useState } from 'react';

const Section = () => {
	const [cards, setCards] = useState([
		{ section: 'section A', description: 'lorem A', order: 1, active: true },
		{ section: 'section B', description: 'description B', order: 2, active: true },
		{ section: 'section C', description: 'ini C', order: 3, active: true },
		{ section: 'section D', description: 'coba D', order: 4, active: true },
		{ section: 'section E', description: 'eeee E', order: 5, active: true },
	]);

	const [editIndex, setEditIndex] = useState(null);
	const [editValue, setEditValue] = useState('');

	const toggleActive = (index) => {
		// Create a copy of the current cards state
		const newCards = [...cards];
		// Update the active status of the selected card
		newCards[index].active = !newCards[index].active;
		// Update the state with the new cards array
		setCards(newCards);
	};

	const moveCard = (index, step) => {
		// Create a copy of the current cards state
		const newCards = [...cards];
		// Check if the selected card is not at the upper or lower bounds
		if ((index === 0 && step === -1) || (index === cards.length - 1 && step === 1)) {
			return;
		}
		// Remove the selected card from the current index
		const [selectedCard] = newCards.splice(index, 1);
		// Update the order of the selected card to match its new index
		selectedCard.order = newCards[index + step].order + step;
		// Insert the selected card at the new index
		newCards.splice(index + step, 0, selectedCard);
		// Re-assign the order of each card based on their index in the sequence
		newCards.forEach((card, i) => {
			card.order = i + 1;
		});
		// Update the state with the new card sequence
		setCards(newCards);
	};

	const handleEdit = (index) => {
		setEditIndex(index);
		setEditValue(cards[index].description);
	};

	const handleChange = (e) => {
		setEditValue(e.target.value);
	};

	const handleSave = (index) => {
		const newCards = [...cards];
		newCards[index].description = editValue;
		setCards(newCards);
		setEditIndex(null);
	};

	return (
		<div className="container my-5">
			{cards.map((card, index) => {
				return (
					<div key={card.section} className="mb-3 card">
						<div className="card-body">
							<div className="row">
								<div className="col-8">
									<h5 className="card-title">{card.section}</h5>
									{editIndex === index ? (
										<form>
											<div className="row">
												<div className="col-2">
													<button
														className="btn btn-info btn-xs me-2"
														type="button"
														onClick={() =>
															handleSave(
																index
															)
														}
													>
														Save
													</button>
												</div>
												<div className="col-10">
													<textarea
														value={
															editValue
														}
														onChange={
															handleChange
														}
														className="form-control"
														rows="4"
														id="comment"
													></textarea>
												</div>
											</div>
										</form>
									) : (
										<div className="row">
											<div className="col-2">
												<button
													className="btn btn-info btn-xs me-2"
													type="button"
													onClick={() =>
														handleEdit(
															index
														)
													}
												>
													Edit
												</button>
											</div>
											<div className="col-10">
												{
													card.description
												}
											</div>
										</div>
									)}
								</div>
								<div className="text-center col-2">
									<button
										className="btn btn-outline-primary me-2"
										onClick={() => moveCard(index, -1)}
										disabled={index === 0}
									>
										<i className="fa fa-arrow-up" />
									</button>
									<button
										className="btn btn-outline-primary"
										onClick={() => moveCard(index, 1)}
										disabled={index === cards.length - 1}
									>
										<i className="fa fa-arrow-down" />
									</button>
								</div>
								<div className="text-center col-2">
									<button
										className={
											card.active
												? 'btn btn-success'
												: 'btn btn-danger'
										}
										onClick={() => toggleActive(index)}
									>
										{card.active ? 'active' : 'inactive'}
									</button>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Section;
