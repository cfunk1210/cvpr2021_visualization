(async function () {
  const legend = d3.select('#legend');
  const data = await d3.json('json/ws_names.json')

  const areas = Array.from(new Set(data.nodes
    .filter((d) => d.group === "primary_subject_area")
    .map((d) => d.id)));

  const sel = legend.select("g")
    .selectAll("circle")
    .data(areas);

  const radius = 10;
  const rows = 70;
  const columns = 1;

  const extraPadding = 10;
  const padding = radius + extraPadding;

  legend.select('g')
    .attr('transform', `translate(${padding},${padding})`);

  const spacing = 2 * radius + 5;
  const column = 930 / columns;

  sel.join("circle")
      .attr("cx", (d, i) => Math.floor(i / rows) * column)
      .attr('cy', (d, i) => (i % rows) * spacing)
      .attr('r', radius)
      .style('fill', (d) => subject_colors(d));

  sel.join('text')
    .attr('x', (d, i) => Math.floor(i / rows) * column + spacing / 2)
    .attr('y', (d, i) => (i % rows) * spacing + radius / 2)
    .text(d => d);

  const bbox = legend.select('g').node().getBBox();
  legend.attr('height', bbox.height + 10);
})();
