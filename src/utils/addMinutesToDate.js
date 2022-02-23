const AddMinutesToDate = (date, minutes) => new Date(date.getTime() + minutes * 60000);

export default AddMinutesToDate;
