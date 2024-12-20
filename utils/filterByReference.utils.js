const filterByReference = (arr1, arr2) => {
  let res = [];
  res = arr1.filter((item) => {
    return !arr2.find((element) => {
      return (
        element.role.toString() === item.role.toString() &&
        element.permission.toString() === item.permission.toString()
      );
    });
  });
  return res;
};

module.exports = filterByReference;
