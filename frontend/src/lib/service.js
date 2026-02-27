import services from "@/data/services.json";
import serviceDetails from "@/data/serviceDetails.json";

export function getCategory(categoryId) {
  return services.categories.find(
    (cat) => cat.id === categoryId
  );
}

export function getService(categoryId, serviceId) {
  const category = getCategory(categoryId);
  if (!category) return null;

  return category.services.find(
    (service) => service.id === serviceId
  );
}

export function getServiceDetails(categoryId, serviceId) {
  return (
    serviceDetails.serviceDetails?.[categoryId]?.[serviceId] ||
    null
  );
}
