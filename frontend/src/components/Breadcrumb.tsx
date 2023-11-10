import {
  Breadcrumb as BaseBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import BreadcrumbIcon from "~/icons/BreadcrumbIcon";

type Props = {
  items: Array<{
    name: string;
    link?: string;
  }>;
};

const Breadcrumb = ({ items }: Props) => (
  <BaseBreadcrumb
    spacing={2}
    fontSize="sm"
    color="blackAlpha.800"
    _dark={{ color: "whiteAlpha.800" }}
    separator={<BreadcrumbIcon mb={1} boxSize="9px" />}
  >
    {items.map((item, i) => (
      <BreadcrumbItem key={i}>
        {item.link ? (
          <BreadcrumbLink as={Link} to={item.link} children={item.name} />
        ) : (
          <Text children={item.name} />
        )}
      </BreadcrumbItem>
    ))}
  </BaseBreadcrumb>
);

export default Breadcrumb;
