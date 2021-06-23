let links = null;
let node = null;
const chart2 = async (countCutoff) => {
  const data = await d3.json('json/key_group_links.json')

  const links = data.links.map(d => Object.create(d))
    .filter(d => d.count > countCutoff);

  const nodes = data.nodes.map(d => Object.create(d))
    .filter(d => d.max_count > countCutoff);
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const [pW, pH] = plot_size();
   width = pW;
  const svg = d3.select('#chart2')
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr('width', pW).attr('height', pH);

  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => 1.5*Math.sqrt(d.count));

  const colormap = subject_colors;

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", (d) => d.group === "primary_subject_area" ? 10 : 5)
      .attr("fill", (d) => d.group === "primary_subject_area" ? colormap(d.id) : "black")
      .call(drag(simulation));

  node.append("title")
      .text(d => d.id);

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });

  return svg.node();
}

function reset(cutoff) {
  d3.select('#chart2')
    .selectAll('*')
    .remove();

  chart2(cutoff);
}

const debouncedReset = _.debounce(reset, 500);
//Below will resize but need to pass default cutoff value somehow
//$(window).on('resize', _.debounce(reset, 150));

d3.select('#slider')
  .on('input', () => {
    const me = d3.select(d3.event.target);
    const cutoff = me.property('value');

    d3.select('#cutoff')
      .text(cutoff);

    debouncedReset(cutoff);
  });

/*
const plot_size = () => {
    const cont = document.getElementById('container');
    const wh = Math.max(window.innerHeight - 280, 300)
    let ww = Math.max(cont.offsetWidth - 210, 300)
    if (cont.offsetWidth < 768) ww = cont.offsetWidth - 10.0;

    if ((wh / ww > 1.3)) {
        const min = Math.min(wh, ww)
        return [min, min]
    } else {
        return [ww, wh]
    }
}
*/

height = 680
const chart = () => {
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.group);
}

drag = simulation => {

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

chart2(4);
